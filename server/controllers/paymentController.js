import database from "../database/db.js";
import razorpay from "../utils/razorpay.js";
import FlintError from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import crypto from "crypto";
import withTransaction from "../utils/withTransaction.js";


export const createPaymentOrder = catchAsyncError(async (req, res, next) => {
  const { orderId } = req.body;

  const { rows } = await database.query(
    `
      SELECT * FROM orders
      WHERE id = $1 AND buyer_id = $2
    `,
    [orderId, req.user.id],
  );

  if (rows.length === 0) {
    throw new FlintError("Order not found.", 404);
  }

  const order = rows[0];

  if (order.paid_at) {
    throw new FlintError("Order already paid.", 400);
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total_price * 100),
    currency: "INR",
    receipt: `ord_${order.id.replaceAll("-", "").slice(0, 16)}`,
  });

  return res.status(200).json({
    success: true,
    razorpayOrder,
  });
});

export const verifyPayment = catchAsyncError(async (req, res) => {
  const {orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

  // Signature verification
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new FlintError("Invalid payment signature.", 400);
  }

  // Transaction
  await withTransaction(async (client) => {
    // Fetch order
    const { rows: orders } = await client.query(
      `SELECT * FROM orders WHERE id = $1 AND buyer_id = $2 FOR UPDATE`, 
      [orderId, req.user.id],
    );

    if (orders.length === 0) {
      throw new FlintError("Order not found.", 404);
    }

    const order = orders[0];

    if (order.paid_at) {
      throw new FlintError("Order already paid.", 400);
    }

    // Insert payment
    await client.query(
      `
        INSERT INTO payments(order_id, payment_type, payment_status, razorpay_order_id, razorpay_payment_id)
        VALUES($1, 'Online', 'Paid', $2, $3)
      `,[order.id, razorpay_order_id, razorpay_payment_id],
    );

    // Fetch order items
    const { rows: items } = await client.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [order.id],
    );

    // Lock products
    const productIds = items.map((item) => item.product_id);
    const { rows: products } = await client.query(
      `SELECT * FROM products WHERE id = ANY($1::UUID[]) FOR UPDATE`, 
      [productIds],
    );

    const productMap = new Map(products.map((p) => [p.id, p]));
    
    // Reduce stock
    const stockCases = [];
    const values = [];
    const idPlaceholders = [];
    items.forEach((item, index) => {
      const product = productMap.get(item.product_id);
      
      if(!product){
        throw new FlintError("Product not found.", 404);
      }
      
      if (item.quantity > product.stock) {
        throw new FlintError(`Stock changed for ${product.name}.`, 400);
      }

      const quantityIndex = index * 2 + 1;
      const idIndex = index * 2 + 2;
      stockCases.push(`WHEN id = $${idIndex} THEN stock - $${quantityIndex}`)
      idPlaceholders.push(`$${idIndex}`);
      values.push(item.quantity, item.product_id);
    })

    await client.query(
      `
        UPDATE products
        SET stock = CASE
          ${stockCases.join("")}
        END 
        WHERE id IN(${idPlaceholders.join(",")})
      `, values
    );
    

    // Mark order paid
    await client.query(
      `UPDATE orders SET paid_at = NOW() WHERE id = $1`,
      [order.id],
    );
  });

  return res.status(200).json({
    success: true,
    message: "Payment verified.",
  });
});

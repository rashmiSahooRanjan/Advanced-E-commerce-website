import database from "../database/db.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import FlintError from "../middlewares/errorMiddleware.js";
import withTransaction from "../utils/withTransaction.js";

export const placeNewOrder = catchAsyncError(async (req, res) => {
  const { shippingInfo, orderItems } = req.body;

  const mergedItems = new Map();

  for (const item of orderItems) {
    const existing = mergedItems.get(item.productId);

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      mergedItems.set(
        item.productId,

        {
          ...item,
        },
      );
    }
  }

  const normalizedItems = Array.from(mergedItems.values());

  const data = await withTransaction(async (client) => {
    // Fetch products
    const productIds = normalizedItems.map((item) => item.productId);
    const { rows: products } = await client.query(
      `
        SELECT id, name, price, stock, images
        FROM products
        WHERE id = ANY($1::UUID[])
        FOR UPDATE
    `,
      [productIds],
    );

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // Validation + price calc
    let subtotal = 0;
    const values = [];
    const placeholders = [];

    for (let index = 0; index < normalizedItems.length; index++) {
      const item = normalizedItems[index];

      const product = productMap.get(item.productId);

      if (!product) {
        throw new FlintError(`Product not found.`, 404);
      }

      if (item.quantity > product.stock) {
        throw new FlintError(
          `Only ${product.stock} units are available for ${product.name}.`,
          400,
        );
      }

      subtotal += product.price * item.quantity;

      values.push(
        null,
        product.id,
        item.quantity,
        product.price,
        product.images?.[0]?.url || "",
        product.name,
      );

      const offset = index * 6;
      placeholders.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`,
      );
    }

    // Price calculation
    const tax_price = Number((subtotal * 0.18).toFixed(2));
    const shipping_price = subtotal + subtotal * 0.18 < 5000 ? 99 : 0;
    const total_price = Number(
      (subtotal + tax_price + shipping_price).toFixed(2),
    );

    // Insert order
    const orderResult = await client.query(
      `
        INSERT INTO orders(buyer_id, total_price, tax_price, shipping_price)
        VALUES( $1,$2,$3,$4 )
        RETURNING *
     `,
      [req.user.id, total_price, tax_price, shipping_price],
    );
    const orderId = orderResult.rows[0].id;
    // Attach orderId
    for (let i = 0; i < values.length; i += 6) {
      values[i] = orderId;
    }

    // Insert order items
    await client.query(
      `
        INSERT INTO order_items(order_id, product_id, quantity, price, image, title)
        VALUES ${placeholders.join(", ")}
      `,
      values,
    );

    // Insert shipping
    await client.query(
      `
        INSERT INTO shipping_info(order_id, full_name, state, city, country, address, pincode, phone)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        `,
      [
        orderId,
        shippingInfo.full_name,
        shippingInfo.state,
        shippingInfo.city,
        shippingInfo.country,
        shippingInfo.address,
        shippingInfo.pincode,
        shippingInfo.phone,
      ],
    );

    // Update stock ==> do this in the payment verification.

    return { orderId, total_price };
  });

  return res.status(201).json({
    success: true,
    message: "Order placed successfully. Proceed to payment.",
    order_id: data.orderId,
    total_price: data.total_price,
  });
});

export const fetchSingleOrder = catchAsyncError(async (req, res) => {
  const { orderId } = req.params;

  const isAdmin = req.user.role === "Admin";

  const result = await database.query(
    `
      SELECT o.*,
      COALESCE(
        json_agg(
          json_build_object(
            'order_item_id', oi.id,
            'order_id', oi.order_id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'::json
      ) AS order_items,
      json_build_object(
        'full_name', s.full_name,
        'state', s.state,
        'city', s.city,
        'country', s.country,
        'address', s.address,
        'pincode', s.pincode,
        'phone', s.phone
      ) AS shipping_info
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_info s ON o.id = s.order_id
      WHERE 
      o.id = $1
      AND ($2 OR o.buyer_id = $3) 
      GROUP BY o.id, s.id;
    `,
    [orderId, isAdmin, req.user.id],
  );

  if (result.rows.length === 0) {
    throw new FlintError("Order not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Order fetched.",
    order: result.rows[0],
  });
});

export const fetchMyOrders = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const result = await database.query(
    `
      SELECT
        o.id,
        o.total_price,
        o.order_status,
        o.created_at,
        o.paid_at,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'image', oi.image,
              'title', oi.title
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) AS order_items
      FROM orders o
      LEFT JOIN order_items oi
      ON o.id = oi.order_id
      WHERE o.buyer_id = $1
      AND o.paid_at IS NOT NULL
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2
      OFFSET $3
    `,
    [req.user.id, limit, offset],
  );

  return res.status(200).json({
    success: true,
    message: "Orders fetched.",
    currentPage: page,
    orders: result.rows,
  });
});

export const fetchAllOrders = catchAsyncError(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const { rows: totalRows } = await database.query(
    `SELECT COUNT(*) FROM orders`,
  );
  const totalOrders = parseInt(totalRows[0].count);

  const { rows: revenueRows } = await database.query(
    `SELECT COALESCE(SUM(total_price), 0) AS revenue FROM orders`,
  );
  const totalRevenue = Number(revenueRows[0].revenue);

  const result = await database.query(
    `
    SELECT 
        o.id,
        o.total_price,
        o.tax_price,
        o.shipping_price,
        o.order_status,
        o.paid_at,
        o.created_at,
      
        -- Buyer Info
        json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
        ) AS buyer,
      
        -- Shipping Info
        json_build_object(
            'fullName', si.full_name,
            'state', si.state,
            'city', si.city,
            'country', si.country,
            'address', si.address,
            'pincode', si.pincode,
            'phone', si.phone
        ) AS shipping_info,
      
        -- Order Items
        COALESCE(
            json_agg(
                json_build_object(
                    'id', oi.id,
                    'productId', oi.product_id,
                    'title', oi.title,
                    'image', oi.image,
                    'quantity', oi.quantity,
                    'price', oi.price
                )
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'
        ) AS order_items
      
    FROM orders o
      
    JOIN users u 
        ON o.buyer_id = u.id
      
    LEFT JOIN shipping_info si 
        ON o.id = si.order_id
      
    LEFT JOIN order_items oi 
        ON o.id = oi.order_id
      
    WHERE o.paid_at IS NOT NULL
        
    GROUP BY 
        o.id,
        u.id,
        si.id
      
    ORDER BY o.created_at DESC
      
    LIMIT $1 OFFSET $2;
    `,
    [limit, offset],
  );

  return res.status(200).json({
    success: true,
    message: "Orders fetched.",
    currentPage: page,
    totalOrders,
    totalPages: Math.ceil(totalOrders / limit),
    totalRevenue,
    orders: result.rows,
  });
});

export const updateOrderStatus = catchAsyncError(async (req, res) => {
  const { orderId } = req.params;
  const { order_status } = req.body;

  const allowedTransitions = {
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };

  // 1. Fetch order
  const { rows } = await database.query(
    `SELECT id, buyer_id, order_status FROM orders WHERE id = $1`,
    [orderId],
  );

  if (rows.length === 0) {
    throw new FlintError("Order not found.", 404);
  }

  const order = rows[0];

  // 2. Check ownership
  if (req.user.role !== "Admin" && order.buyer_id !== req.user.id) {
    throw new FlintError("Order not found.", 404);
  }

  // 3. Check for finished states
  if (
    order.order_status === "Delivered" ||
    order.order_status === "Cancelled"
  ) {
    throw new FlintError(
      `${order.order_status} orders cannot be updated.`,
      400,
    );
  }

  // 4. Customer-specific rules
  if (req.user.role !== "Admin") {
    if (order_status !== "Cancelled") {
      throw new FlintError("You are not authorized.", 403);
    }

    if (order.order_status !== "Processing") {
      throw new FlintError("Order can no longer be cancelled.", 400);
    }
  }

  // 5. Validate status flow
  const allowedNextStatuses = allowedTransitions[order.order_status];

  if (!allowedNextStatuses.includes(order_status)) {
    throw new FlintError(
      `Invalid status transition from ${order.order_status} to ${order_status}.`,
      400,
    );
  }

  // 6. Update database
  await database.query(`UPDATE orders SET order_status = $1 WHERE id = $2`, [
    order_status,
    orderId,
  ]);

  return res.status(200).json({
    success: true,
    message: "Order status updated.",
  });
});

import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import FlintError from "../middlewares/errorMiddleware.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";
import { stopWords } from "../utils/stopWords.js";
import { getAIRecomendation } from "../utils/getAIRecomendation.js";

export const createProduct = catchAsyncError(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const created_by = req.user.id;

  let uploadedImages = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const reesult = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "products",
        width: 1000,
        crop: "scale",
      });

      uploadedImages.push({
        public_id: reesult.public_id,
        url: reesult.secure_url,
      });
    }
  }

  const product = await database.query(
    `
        INSERT INTO products (name, description, price, category, stock, created_by, images) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING
            id,
            name,
            description,
            price,
            category,
            stock,
            images,
            created_by,
            created_at
    `,
    [
      name,
      description,
      price,
      category,
      stock,
      created_by,
      JSON.stringify(uploadedImages),
    ],
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: product.rows[0],
  });
});

export const fetchAllProducts = catchAsyncError(async (req, res, next) => {
  const { availability, price, category, ratings, search } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  let values = [];
  let index = 1;

  let paginationPlaceholders = {};

  // Availability filter -> filters products based on stock levels, allowing users to find in-stock, limited-stock, or out-of-stock items.
  if (availability === "in-stock") {
    conditions.push(`stock > 0`);
  } else if (availability === "limited-stock") {
    conditions.push(`stock > 0 AND stock <= 5`);
  } else if (availability === "out-of-stock") {
    conditions.push(`stock = 0`);
  }

  // Price filter -> allows users to filter products based on a price range.
  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    if (minPrice && maxPrice) {
      conditions.push(`price BETWEEN $${index} AND $${index + 1}`);
      values.push(Number(minPrice), Number(maxPrice));
      index += 2;
    }
  }

  // Category filter -> enables users to filter products by category, making it easier to find items in specific categories.
  if (category) {
    conditions.push(`LOWER(category) = LOWER($${index})`);
    values.push(category);
    index++;
  }

  // Ratings filter -> allows users to filter products based on average ratings, helping them find highly-rated items.
  if (ratings) {
    conditions.push(`ratings >= $${index}`);
    values.push(ratings);
    index++;
  }

  // Search filter -> provides a search functionality that allows users to find products based on keywords in the product name or description.
  if (search) {
    conditions.push(
      `(p.name ILIKE $${index} OR p.description ILIKE $${index})`,
    );
    values.push(`%${search}%`);
    index++;
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Get total count of products matching the filters
  const totalProductsResult = await database.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    values,
  );
  const totalProducts = parseInt(totalProductsResult.rows[0].count);

  paginationPlaceholders.limit = `$${index}`;
  values.push(limit);
  index++;

  paginationPlaceholders.offset = `$${index}`;
  values.push(offset);
  index++;

  // Fetch with reviews
  const query = `
        SELECT p.*, 
        COUNT(r.id) AS review_count 
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ${paginationPlaceholders.limit} OFFSET ${paginationPlaceholders.offset}
    `;
  const result = await database.query(query, values);

  // Fetch new products (added in the last 30 days)
  const newProductsQuery = `
        SELECT p.*,
        COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 8
    `;
  const newProductsResult = await database.query(newProductsQuery);

  // Fetch top-rated products (average rating of 4 or higher)
  const topRatedProductsQuery = `
        SELECT p.*,
        COUNT(r.id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.ratings >= 4
        GROUP BY p.id
        ORDER BY p.ratings DESC, review_count DESC, p.created_at DESC
        LIMIT 8
    `;
  const topRatedProductsResult = await database.query(topRatedProductsQuery);

  const totalPages = Math.ceil(totalProducts / limit);

  res.status(200).json({
    success: true,
    products: result.rows,
    totalProducts,
    newProducts: newProductsResult.rows,
    topRatedProducts: topRatedProductsResult.rows,
    totalPages,
    currentPage: page,
  });
});

export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, category, stock } = req.body;

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  if (product.rows.length === 0) {
    return next(new FlintError("Product not found", 404));
  }

  if (req.user.role !== "Admin" && product.rows[0].created_by !== req.user.id) {
    return next(
      new FlintError("You are not authorized to update this product.", 403),
    );
  }

  const result = await database.query(
    `UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5 WHERE id = $6 RETURNING *`,
    [
      name ?? product.rows[0].name,
      description ?? product.rows[0].description,
      price ?? product.rows[0].price,
      category ?? product.rows[0].category,
      stock ?? product.rows[0].stock,
      productId,
    ],
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    product: result.rows[0],
  });
});

export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  if (product.rows.length === 0) {
    return next(new FlintError("Product not found", 404));
  }

  if (req.user.role !== "Admin" && product.rows[0].created_by !== req.user.id) {
    return next(
      new FlintError("You are not authorized to update this product.", 403),
    );
  }

  const images = product.rows[0].images;
  if (images && images.length > 0) {
    for (const image of images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  const deleteResult = await database.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [productId],
  );

  if (deleteResult.rowCount === 0) {
    return next(new FlintError("Failed to delete product.", 500));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    deletedProduct: deleteResult.rows[0],
  });
});

export const fetchSingleProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  const result = await database.query(
    `
            SELECT p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'review_id', r.id,
                            'rating', r.rating,
                            'comment', r.comment,
                            'reviewer', json_build_object(
                                'id', u.id,
                                'name', u.name,
                                'avatar', u.avatar
                            )
                        )
                    )
                    FILTER(WHERE r.id IS NOT NULL), '[]'
                )
                AS reviews
                FROM products p
                LEFT JOIN reviews r ON p.id = r.product_id
                LEFT JOIN users u ON r.user_id = u.id
                WHERE p.id = $1
                GROUP BY p.id
        `,
    [productId],
  );

  if (result.rows.length === 0) {
    return next(new FlintError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    product: result.rows[0],
  });
});

// Product Review APIs
// ==================
export const createProductReview = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const user_id = req.user.id;

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  if (product.rows.length === 0) {
    return next(new FlintError("Product not found.", 404));
  }

  const purchaseCheckQuery = `
    SELECT oi.product_id
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN payments p ON p.order_id = o.id
    WHERE o.buyer_id = $1
    AND oi.product_id = $2
    AND p.payment_status = 'Paid'
    AND o.order_status = 'Delivered'
    LIMIT 1;
  `;
  const { rows } = await database.query(purchaseCheckQuery, [
    user_id,
    productId,
  ]);

  if (rows.length === 0) {
    return next(
      new FlintError(
        "You must purchase and receive the product before leaving a review.",
        400,
      ),
    );
  }

  const hasAlreadyReviewed = await database.query(
    "SELECT * FROM reviews WHERE product_id = $1 AND user_id = $2",
    [productId, user_id],
  );

  let reviews;
  if (hasAlreadyReviewed.rows.length > 0) {
    reviews = await database.query(
      "UPDATE reviews SET rating = $1, comment = $2 WHERE product_id = $3 AND user_id = $4 RETURNING *",
      [rating, comment, productId, user_id],
    );
  } else {
    reviews = await database.query(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
      [productId, user_id, rating, comment],
    );
  }

  // Update Average Ratings
  const allReviews = await database.query(
    "SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = $1",
    [productId],
  );

  const newAvgRating = allReviews.rows[0].avg_rating || 0;

  const updatedProduct = await database.query(
    "UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *",
    [newAvgRating, productId],
  );

  res.status(200).json({
    success: true,
    message:
      hasAlreadyReviewed.rows.length > 0
        ? "Review updated successfully."
        : "Review added successfully.",
    review: reviews.rows[0],
    product: updatedProduct.rows[0],
  });
});

export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const user_id = req.user.id;

  const review = await database.query(
    "DELETE FROM reviews WHERE product_id = $1 AND user_id = $2 RETURNING *",
    [productId, user_id],
  );

  if (review.rows.length === 0) {
    return next(new FlintError("Review not Found.", 404));
  }

  const allReviews = await database.query(
    "SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = $1",
    [productId],
  );

  const newAvgRating = allReviews.rows[0].avg_rating || 0;

  const updatedProduct = await database.query(
    "UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *",
    [newAvgRating, productId],
  );

  res.status(200).json({
    success: true,
    message: "Your review has been deleted successfully.",
    product: updatedProduct.rows[0],
    review: review.rows[0],
  });
});


// AI Based Search API
// ===================
export const fetchAIFilteredProducts = catchAsyncError(
  async (req, res, next) => {
    const { userPrompt } = req.body;

    if (!userPrompt) throw new FlintError("Provide a valid prompt.", 400);

    const filterKeywords = (query) => {
      return query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => !stopWords.has(word))
        .map((word) => `%${word}%`);
    };

    const keywords = filterKeywords(userPrompt);
    // STEP1: Basic SQL Filtering
    const result = await database.query(
      `
        SELECT * FROM products
        WHERE name ILIKE ANY($1)
        OR description ILIKE ANY($1)
        OR category ILIKE ANY($1)
        LIMIT 50
      `,
      [keywords]
    );

    const FilteredProducts = result.rows;
    if(FilteredProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found matching your prompt.",
        products: []
      });
    }

    // STEP-2: Ai Filtering
    // const x = await getAIRecomendation(req, res, userPrompt, FilteredProducts);
    // console.log(x, x.success, x.products);
    // if(!success){
    //   return res.status(500).json({
    //     success: false,
    //     message: "No product matched the user's request",
    //     products: []
    //   })
    // }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      products: result.rows,
    });
  
  },
);

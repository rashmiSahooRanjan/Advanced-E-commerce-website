import FlintError from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;

    const totalUsersResult = await database.query(
        "SELECT COUNT(*) FROM users WHERE role = $1",
        ["Customer"]
    );

    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    const offset = (page-1) * 10;

    const users = await database.query(
        "SELECT id, name, email, avatar, role, created_at FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
        ["Customer", 10, offset]
    );

    res.status(200).json({
        success: true,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / 10),
        users: users.rows
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;

    if(id === req.user.id){
        throw new FlintError("You cannot delete your own admin account.", 400)
    }

    const deleteUser = await database.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
    );

    if(deleteUser.rows.length === 0){
        return next (new FlintError("User not found", 404));
    }

    const avatar = deleteUser.rows[0].avatar;
    if(avatar?.public_id){
        await cloudinary.uploader.destroy(avatar.public_id);
    }

    res.status(200).json({
        success: true,
        message: "User deleted Successfully."
    });
})

export const fetchDashboardStats = catchAsyncError(async (req, res, next) => {
    const today = new Date();

    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth()+1, 0);
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth()-1, 1);
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const totalRevenueAllTimeQuery = await database.query(
        "SELECT SUM(total_price) FROM orders WHERE order_status = 'Delivered'"
    );

    const totalRevenueAllTime = parseFloat(totalRevenueAllTimeQuery.rows[0].sum) || 0;

    // Total Users
    const totalUsersCountQuery = await database.query(
        "SELECT COUNT(*) FROM users WHERE role = 'Customer'"
    );

    const totalUsersCount = parseInt(totalUsersCountQuery.rows[0].count) || 0;

    const orderStatusCountQuery = await database.query(
        "SELECT order_status, COUNT(*) FROM orders GROUP BY order_status"
    );

    const orderStatusCounts = {
        Processing:0, Shipped:0, Delivered:0, Cancelled:0
    }

    orderStatusCountQuery.rows.forEach((row) => {
        orderStatusCounts[row.order_status] = parseInt(row.count) || 0;
    })


    // Today's Revenue
    const todayRevenueQuery = await database.query(
        "SELECT SUM(total_price) FROM orders WHERE created_at::date = CURRENT_DATE AND order_status = 'Delivered'"
    );
    const todayRevenue = parseFloat(todayRevenueQuery.rows[0].sum) || 0;

    // Yesterday's Revenue
    const yesterdayRevenueQuery = await database.query(
        "SELECT SUM(total_price) FROM orders WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day' AND order_status = 'Delivered'"
    );
    const yesterdayRevenue = parseFloat(yesterdayRevenueQuery.rows[0].sum) || 0;


    // Monthly Sales For Line Chart
    const monthlySalesQuery = await database.query(
        `
        SELECT
        TO_CHAR(created_at, 'Mon YYYY') AS month,
        DATE_TRUNC('month', created_at) AS date,
        SUM(total_price) as totalSales
        FROM orders
        WHERE order_status = 'Delivered'
        GROUP BY month, date
        ORDER BY date ASC
        `
    );
    const monthlySales = monthlySalesQuery.rows.map( row => ({
        month: row.month,
        totalSales: parseFloat(row.totalSales) || 0
    }));

    // Top 5 most sold products
    const topSellingProductsQuery = await database.query(
        `
        SELECT p.name,
        p.images -> 0 ->> 'url' AS image,
        p.category,
        p.ratings,
        SUM(oi.quantity) AS total_sold
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        GROUP BY p.id, p.name, p.images, p.category, p.ratings
        ORDER BY total_sold DESC
        LIMIT 5
        `
    );
    const topProducts = topSellingProductsQuery.rows;

    // Total sales of current month.
    const currentMonthSalesQuery = await database.query(
        `
        SELECT SUM(total_price) AS total
        FROM orders
        WHERE created_at BETWEEN $1 AND $2 AND order_status = 'Delivered'
        `, [currentMonthStart, currentMonthEnd]
    );
    const currentMonthSales = parseFloat(currentMonthSalesQuery.rows[0].total) || 0;

    // Products with stock less than or equal to 5
    const lowStockProductQuery = await database.query(
        "SELECT name, stock FROM products WHERE stock <= 5"
    );
    const lowStockProducts = lowStockProductQuery.rows;

    // Revenue Growth Rate (%)
    const lastMonthRevenueQuery = await database.query(
        `
        SELECT SUM(total_price) AS total
        FROM orders
        WHERE created_at BETWEEN $1 AND $2 AND order_status = 'Delivered'
        `,
        [previousMonthStart, previousMonthEnd]
    );
    const lastMonthRevenue =  parseFloat(lastMonthRevenueQuery.rows[0].total) || 0;
    
    let revenueGrowth = '0%';
    if(lastMonthRevenue > 0){
        const growthRate = ((currentMonthSales - lastMonthRevenue) / lastMonthRevenue) * 100;
        revenueGrowth = `${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(2)}%`;
    }

    // New users this month
    const newUsersThisMonthQuery = await database.query(
        `
        SELECT COUNT(*) FROM users WHERE created_at >= $1 AND role = 'Customer'
        `, [currentMonthStart]
    );
    const newUsersThisMonth = parseInt(newUsersThisMonthQuery.rows[0].count) || 0;

    res.status(200).json({
        success: true,
        message:"Dashboard Stats Fetched Successfully.",
        totalRevenueAllTime,
        todayRevenue,
        yesterdayRevenue,
        totalUsersCount,
        orderStatusCounts,
        monthlySales,
        currentMonthSales,
        topSellingProducts: topProducts,
        lowStockProducts,
        revenueGrowth,
        newUsersThisMonth
    });



});
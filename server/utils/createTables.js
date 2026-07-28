import {
    createOrderItemTable, 
    createOrdersTable,
    createPaymentsTable,
    createProductReviewsTable,
    createProductsTable,
    createShippingInfoTable,
    createUserTable
} from '../models/index.js';

export const createTables = async () => {
    try {
        await createUserTable();
        await createProductsTable();
        await createOrdersTable();
        await createOrderItemTable();
        await createShippingInfoTable();
        await createPaymentsTable();
        await createProductReviewsTable();
        console.log("All Tables Created Successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}
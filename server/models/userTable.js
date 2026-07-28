import database from "../database/db.js"

export async function createUserTable(){
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL CHECK(char_length(name) > 1),
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(10) DEFAULT 'Customer' CHECK(role IN ('Customer','Seller','Admin')),
                avatar JSONB DEFAULT NULL,
                reset_password_token TEXT DEFAULT NULL,
                reset_password_expires TIMESTAMP DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await database.query(query);
    } catch (error) {
        console.error("Error createing users table: ", error);
        process.exit(1);
    }
}

// VARCHAR -> ONLY LETTERS AND NUMBERS, NO SPECIAL CHARACTERS
// TEXT -> ANYTHING, INCLUDING SPECIAL CHARACTERS
// JSONB -> JSON OBJECTS, CAN BE USED TO STORE AVATAR URL AND OTHER INFO IN THE FUTURE
import mongoose from "mongoose";
import 'dotenv/config'


export const connectDb = async () => {
    const DATABASE_URL = process.env.DATABASE_URL || ""; 
    try {

        await mongoose.connect(DATABASE_URL , {
        });

        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Failed to connect to the database');
    }

    // Optional: Add connection event listeners for more detailed status tracking
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to database');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
        throw new Error('Mongoose connection error');
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });
};

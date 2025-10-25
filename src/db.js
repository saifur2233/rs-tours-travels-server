import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.g79cke1.mongodb.net/rstourtravel`;

export async function connectDB() {
    if (!MONGO_URL) {
        throw new Error("MONGODB_URI missing");
    }
    await mongoose.connect(MONGO_URL, {
        autoIndex: true
    });
    console.log("MongoDB connected");
}

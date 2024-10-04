import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || "3000",
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/user_service",
    JWT_SECRET: process.env.JWT_SECRET || "abhiabhishektrOnGitHub", //also in likedIn 😁
    EXTERNAL_API_URL: process.env.EXTERNAL_API_URL,
    KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL||"localhost:9092",
    SERVICE: process.env.SERVICE || "user-service",
};
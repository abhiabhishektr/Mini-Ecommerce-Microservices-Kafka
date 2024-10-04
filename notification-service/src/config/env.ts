import dotenv from "dotenv";

dotenv.config();

export const env = {
    KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL || 'localhost:9092',
    EMAIL_USER: process.env.EMAIL_USER || "abhiabhishektrOnGitHub", //also in likedIn 😁
    EMAIL_PASS: process.env.EMAIL_PASS || "abhiabhishektrOnGitHub", //also in likedIn 😁
};


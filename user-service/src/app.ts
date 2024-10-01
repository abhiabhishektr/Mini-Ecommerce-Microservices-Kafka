import "reflect-metadata";
import express from "express";
import connectDB from "./config/DatabaseConfig";
import container from "./inversify.config";
import { userRouter } from "./routes/user.route";
import { UserController } from "./controllers/user.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(errorMiddleware);

// Routes
const userController = container.get<UserController>(UserController);
app.use("/users", userRouter(userController));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

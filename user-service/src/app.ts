import "reflect-metadata";
import express, { Request, Response, NextFunction } from 'express';
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


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next(); 
});
// Middleware
app.use(express.json());
app.use(errorMiddleware);

// Routes
const userController = container.get<UserController>(UserController);
app.use("/api/user", userRouter(userController));

app.use((req: Request, res: Response) => {
    console.log(`Unmatched route: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Start server 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

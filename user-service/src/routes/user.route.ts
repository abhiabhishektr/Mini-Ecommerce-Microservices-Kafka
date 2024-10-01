import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const userRouter = (userController: UserController) => {
    const router = Router();
    router.post("/", userController.register.bind(userController));
    router.post("/login", userController.login.bind(userController));
    return router;
};

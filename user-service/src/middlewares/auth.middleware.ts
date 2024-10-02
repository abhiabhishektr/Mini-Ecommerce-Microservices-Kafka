import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    user?: string | object; // You can define this type based on your token structure
}
export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
       req.user= decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

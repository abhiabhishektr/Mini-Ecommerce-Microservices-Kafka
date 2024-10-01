import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class JwtService {
    static generateToken(userId: string) {
        return jwt.sign({ id: userId }, env.JWT_SECRET, {
            expiresIn: "1h",
        });
    }
}

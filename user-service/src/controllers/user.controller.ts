import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IUserUseCase } from "../interfaces/IUserUseCase";

@injectable()
export class UserController {
    constructor(@inject("IUserUseCase") private userUseCase: IUserUseCase) {}

    async register(req: Request, res: Response) {
        try {
            const user = await this.userUseCase.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const token = await this.userUseCase.login(req.body.email, req.body.password);
            res.status(200).json({ token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

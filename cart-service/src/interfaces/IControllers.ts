// src/interfaces/IControllers.ts
import { Request, Response } from 'express';

export interface IControllers {
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    checkout(req: Request, res: Response): Promise<void>;
    checkOrderStatus(req: Request, res: Response): Promise<void>;
}

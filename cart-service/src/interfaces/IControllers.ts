import { Request, Response } from 'express';

export interface IControllers {
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
}

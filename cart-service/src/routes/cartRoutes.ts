import { Router } from 'express';
import { IControllers } from '../interfaces/IControllers';

const router = Router();

export default function cartRoutes(cartController: IControllers) {
    router.post('/carts', cartController.create.bind(cartController));
    router.put('/carts/:cartId', cartController.update.bind(cartController));
    return router;
}

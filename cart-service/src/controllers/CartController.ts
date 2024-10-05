// cart-service/src/controllers/CartController.ts
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ICartService } from '../interfaces/ICartService';
import { IControllers } from '../interfaces/IControllers';

@injectable()
export class CartController implements IControllers {
    constructor(@inject('ICartService') private cartService: ICartService) {}


    async create(req: Request, res: Response): Promise<void> {
        try {
            const cart = await this.cartService.createCart(req.body);
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const cartId = req.params.cartId;
            const items = req.body.items;
            const updatedCart = await this.cartService.updateCart(cartId, items);
            if (!updatedCart) {
                res.status(404).json({ message: 'Cart not found' });
            } else {
                res.status(200).json(updatedCart);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async checkout(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId; // Assuming the user ID is sent in the request body
            const cartId = req.params.cartId;
            const order = await this.cartService.processCheckout(cartId, userId);
            if (!order) {
                res.status(404).json({ message: 'Cart not found or checkout failed' });
            } else {
                res.status(200).json(order);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async checkOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.orderId; // Get orderId from route parameters
            const order = await this.cartService.checkOrderStatus(orderId);
            if (!order) {
                res.status(404).json({ message: 'Order not found' });
            } else {
                res.status(200).json(order);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

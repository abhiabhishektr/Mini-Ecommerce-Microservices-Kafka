// src/interfaces/ICartService.ts
import { ICart } from '../models/CartModel';
import { IOrder } from '../models/OrderModel'; // Assuming you have an IOrder model

export interface ICartService {
    createCart(cart: ICart): Promise<ICart>;
    updateCart(cartId: string, items: { productId: string; quantity: number }[]): Promise<ICart | null>;
    processCheckout(cartId: string, userId: string): Promise<IOrder | null>; // New method for checkout
    checkOrderStatus(orderId: string): Promise<IOrder | null>;
}

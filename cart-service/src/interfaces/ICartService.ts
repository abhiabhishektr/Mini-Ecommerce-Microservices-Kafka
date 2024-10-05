import { ICart } from '../models/CartModel';

export interface ICartService {
    createCart(cart: ICart): Promise<ICart>;
    updateCart(cartId: string, items: { productId: string; quantity: number }[]): Promise<ICart | null>;
}

// cart-service/src/services/CartService.ts
import { injectable, inject } from 'inversify';
import { ICartService } from '../interfaces/ICartService';
import { ICart, CartModel } from '../models/CartModel';
import { IOrder, OrderModel } from '../models/OrderModel';
import { ExternalService } from './ExternalService'; 
import { IExternalService } from '../interfaces/IExternalService'; 

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject("IExternalService") private externalService: IExternalService 
    ) {
        this.initializeConsumer();
    } 

    async createCart(cart: ICart): Promise<ICart> {
        return CartModel.create(cart);
    }

    async updateCart(cartId: string, items: { productId: string; quantity: number }[]): Promise<ICart | null> {
        return CartModel.findByIdAndUpdate(cartId, { items }, { new: true });
    }

    async processCheckout(cartId: string, userId: string): Promise<IOrder> {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }

        const order = await OrderModel.create({ userId, cartId, status: 'unverified' });

        await this.externalService.sendMessage('check-product-availability', {
            items: cart.items,
            cartId,
        });

        return order; 
    }
    private async initializeConsumer() {
        await this.externalService.consumeMessages('availability-response', async (message) => {
            const { cartId, available } = message;
            await this.updateOrderStatus(cartId, available);
        });
    }

    private async updateOrderStatus(cartId: string, available: boolean): Promise<void> {
        try {
            const order = await OrderModel.findOne({ cartId: cartId })

            if (order) {
                order.status = available ? 'confirmed' : 'failed';
                await order.save();
                console.log(`Order ${cartId} has been ${available ? 'confirmed' : 'failed'}.`);
            } else {
                console.error(`Order with ID ${cartId} not found.`);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }
    async checkOrderStatus(orderId: string): Promise<IOrder | null> {
        return OrderModel.findById(orderId);
    }
}

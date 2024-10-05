// cart-service/src/services/CartService.ts
import { injectable } from 'inversify';
import { ICartService } from '../interfaces/ICartService';
import { ICart, CartModel } from '../models/CartModel';

@injectable()
export class CartService implements ICartService {
    async createCart(cart: ICart): Promise<ICart> {
        return CartModel.create(cart);
    }

    async updateCart(cartId: string, items: { productId: string; quantity: number }[]): Promise<ICart | null> {
        return CartModel.findByIdAndUpdate(cartId, { items }, { new: true });
    }
}



// // cart-service/src/services/CartService.ts
// import { Kafka } from 'kafkajs';
// import { inject, injectable } from 'inversify';
// import { ICartService } from '../interfaces/ICartService';
// import { ICart, CartModel } from '../models/CartModel';
// import { TYPES } from '../types';

// @injectable()
// export class CartService implements ICartService {
//     private kafka;
//     private producer;

//     constructor(
//         @inject(TYPES.KafkaClient) kafka: Kafka
//     ) {
//         console.log('Initializing Kafka for CartService...');
//         this.kafka = kafka;
//         this.producer = this.kafka.producer();
//         this.initializeKafka();
//     }

//     private async initializeKafka() {
//         try {
//             console.log('Connecting Kafka producer for CartService...');
//             await this.producer.connect();
//             console.log('Producer connected successfully.');
//         } catch (error) {
//             console.error('Error initializing Kafka producer:', error);
//         }
//     }

//     async createCart(cart: ICart): Promise<ICart> {
//         const createdCart = await CartModel.create(cart);

//         await this.producer.send({
//             topic: 'cart-creation',
//             messages: [{ value: JSON.stringify({ cartId: createdCart.id, ...cart }) }],
//         });
//         console.log(`Cart created and event sent to Kafka: ${createdCart.id}`);

//         return createdCart;
//     }

//     async updateCart(cartId: string, items: { productId: string; quantity: number }[]): Promise<ICart | null> {
//         const updatedCart = await CartModel.findByIdAndUpdate(cartId, { items }, { new: true });

//         if (updatedCart) {
//             await this.producer.send({
//                 topic: 'cart-update',
//                 messages: [{ value: JSON.stringify({ cartId, items }) }],
//             });
//             console.log(`Cart updated and event sent to Kafka: ${cartId}`);
//         }

//         return updatedCart;
//     }

//     async disconnect() {
//         try {
//             console.log('Disconnecting Kafka producer...');
//             await this.producer.disconnect();
//             console.log('Producer disconnected successfully.');
//         } catch (error) {
//             console.error('Error disconnecting Kafka producer:', error);
//         }
//     }
// }

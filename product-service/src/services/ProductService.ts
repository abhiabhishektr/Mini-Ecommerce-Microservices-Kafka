// src/services/ProductService.ts
import { Kafka } from 'kafkajs';
import { inject, injectable } from 'inversify';
import { IProductService } from '../interfaces/IProductService';
import ProductModel, { IProductModel } from '../models/ProductModel';
import { TYPES } from '../types';
import ReviewModel, { IReviewModel } from '../models/ReviewModel';

@injectable()
export class ProductService implements IProductService {
    private kafka;
    private producer;

    constructor(@inject(TYPES.KafkaClient) kafka: Kafka) {
        console.log('Initializing Kafka for ProductService...');
        this.kafka = kafka;
        this.producer = this.kafka.producer();
        this.initializeKafka();
        this.initializeConsumer();
    }

    private async initializeKafka() {
        try {
            console.log('Connecting Kafka producer for ProductService...');
            await this.producer.connect();
            console.log('Producer connected successfully.');
        } catch (error) {
            console.error('Error initializing Kafka producer:', error);
        }
    }

    async createProduct(productData: { name: string; price: number; description: string; quantity: number }): Promise<IProductModel> {
        const product = await ProductModel.create(productData);

        await this.producer.send({
            topic: 'product-creation',
            messages: [{ value: JSON.stringify({ productId: product.id, ...productData }) }],
        });
        console.log(`Product created and event sent to Kafka: ${product.id}`);

        return product;
    }

    async updateProduct(productId: string, productData: { name?: string; price?: number; description?: string; quantity?: number }): Promise<IProductModel | null> {
        const product = await ProductModel.findByIdAndUpdate(productId, productData, { new: true });

        if (product) {
            await this.producer.send({
                topic: 'product-update',
                messages: [{ value: JSON.stringify({ productId, ...productData }) }],
            });
            console.log(`Product updated and event sent to Kafka: ${productId}`);
        }

        return product;
    }

    async handleReview(reviewData: { productId: string; rating: number; comment: string; userId: string }): Promise<void> {
        const product = await ProductModel.findById(reviewData.productId);

        if (!product) {
            throw new Error("Product not found");
        }

        // Create a new review
        const review: IReviewModel = await ReviewModel.create({
            productId: reviewData.productId,
            userId: reviewData.userId,
            rating: reviewData.rating,
            comment: reviewData.comment,
        });

        product.reviewCount += 1;

        product.averageRating = (product.averageRating * (product.reviewCount - 1) + reviewData.rating) / product.reviewCount;

        await product.save();
    }

    private async initializeConsumer() {
        const consumer = this.kafka.consumer({ groupId: 'product-consumer-group' });

        await consumer.connect();
        await consumer.subscribe({ topic: 'product-reviewed', fromBeginning: true });
        await consumer.subscribe({ topic: 'check-product-availability', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const data = JSON.parse(message.value!.toString());

                if (topic === 'product-reviewed') {
                    await this.handleReview(data);
                } else if (topic === 'check-product-availability') {
                    const availability = await this.checkProductAvailability(data.items);
                    console.log(`Product availability check result: ${availability}`);

                    await this.producer.send({
                        topic: 'availability-response',
                        messages: [
                            {
                                value: JSON.stringify({
                                    cartId: data.cartId, 
                                    requestId: data.requestId, 
                                    available: availability,
                                }),
                            },
                        ],
                    });
                }
            },
        });

        console.log('Consumer connected and listening for product reviews and availability checks...');
    }

    async disconnect() {
        try {
            console.log('Disconnecting Kafka producer...');
            await this.producer.disconnect();
            console.log('Producer disconnected successfully.');
        } catch (error) {
            console.error('Error disconnecting Kafka producer:', error);
        }
    }

    async getProductById(productId: string): Promise<IProductModel | null> {
        return ProductModel.findById(productId);
    }

    async getAllProducts(): Promise<IProductModel[]> {
        return ProductModel.find();
    }

    async checkProductAvailability(items: { productId: string; quantity: number }[]): Promise<boolean> {
        const productIds = items.map(item => item.productId);
        const products = await ProductModel.find({ _id: { $in: productIds } });

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product || product.quantity < item.quantity) {
                console.log(`Product ${item.productId} is not available in sufficient quantity.`);
                return false;
            }
        }

        console.log('All products are available in required quantities.');
        return true;
    }
}

import { Kafka } from 'kafkajs';
import { inject, injectable } from 'inversify';
import { IProductService } from '../interfaces/IProductService';
import ProductModel, { IProductModel } from '../models/ProductModel';
import { TYPES } from '../types';  


@injectable()
export class ProductService implements IProductService {
    private kafka;
    private producer;

    constructor(
        @inject(TYPES.KafkaClient) kafka: Kafka
    ) {
        console.log('Initializing Kafka for ProductService...');
        this.kafka = kafka;
        this.producer = this.kafka.producer();
        this.initializeKafka();
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

    async disconnect() {
        try {
            console.log('Disconnecting Kafka producer...');
            await this.producer.disconnect();
            console.log('Producer disconnected successfully.');
        } catch (error) {
            console.error('Error disconnecting Kafka producer:', error);
        }
    }
}

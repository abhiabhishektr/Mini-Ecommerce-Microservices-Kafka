import { Container } from 'inversify';
import { Kafka } from 'kafkajs';
import { ProductService } from './services/ProductService';
import { TYPES } from './types'; 
import { ProductController } from './controllers/ProductController';

// Create Inversify container
const container = new Container();

// Bind Kafka Client
container.bind<Kafka>(TYPES.KafkaClient).toConstantValue(
    new Kafka({
        clientId: 'product-service',
        brokers: ['localhost:9092'],
    })
);

// Bind ProductService
container.bind<ProductService>(TYPES.IProductService).to(ProductService);

// Bind ProductController
container.bind<ProductController>(ProductController).toSelf();

export { container };

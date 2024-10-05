// cart-service/src/index.ts
import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env';
import cartRoutes from './routes/cartRoutes';
import { CartService } from './services/CartService';
import { Container } from 'inversify';
import { CartController } from './controllers/CartController';
import { IControllers } from './interfaces/IControllers';
import { ICartService } from './interfaces/ICartService';
import { Kafka } from 'kafkajs'; // Import Kafka

// Define string identifiers for dependency injection
const CONTROLLER_IDENTIFIER = 'IControllers';
const SERVICE_IDENTIFIER = 'ICartService';

// Create Kafka instance
const kafka = new Kafka({
    clientId: 'cart-service',
    brokers: ['localhost:9092'] // Change to your Kafka broker addresses
});

// Create a producer
const producer = kafka.producer();

async function startService() {
    const app = express();
    app.use(express.json());
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/testInversify');
    console.log('Connected to MongoDB.');

    // Connect to Kafka
    await producer.connect();
    console.log('Connected to Kafka.');

    // Register services with dependency injection
    const container = new Container();
    container.bind<IControllers>(CONTROLLER_IDENTIFIER).to(CartController);
    container.bind<ICartService>(SERVICE_IDENTIFIER).to(CartService);

    // Resolve the CartController from the container
    const cartController = container.get<IControllers>(CONTROLLER_IDENTIFIER);

    // Example: Send a message to Kafka when a cart is modified (this would be implemented in your CartService)
    // await producer.send({
    //     topic: 'cart-events',
    //     messages: [
    //         { value: 'Cart modified' },
    //     ],
    // });

    // Set up routes
    app.use('/api', cartRoutes(cartController));

    // Start server
    app.listen(env.PORT, () => {
        console.log(`Cart Service is running on port ${env.PORT}`);
    });
}

startService();

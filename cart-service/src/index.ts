import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env';
import cartRoutes from './routes/cartRoutes';
import { container } from './inversify.config';
import { IControllers } from './interfaces/IControllers';
import { IExternalService } from './interfaces/IExternalService';

async function startService() {
    const app = express();
    app.use(express.json());

    await mongoose.connect('mongodb://localhost:27017/cart-service');
    console.log('Connected to MongoDB.');

    container.get<IExternalService>('IExternalService');

    console.log('Connected to Kafka.');

    const cartController = container.get<IControllers>('IControllers');

    app.use('/api/cart', cartRoutes(cartController));

    app.listen(env.PORT, () => {
        console.log(`Cart Service is running on port ${env.PORT}`);
    });
}

startService().catch(console.error);
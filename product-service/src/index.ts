import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env';
import productRoutes from './routes/productRoutes';
import { container } from './inversify.config'; 
import { ProductService } from './services/ProductService';

async function startService() {
    const app = express();
    app.use(express.json()); // Middleware to parse JSON body

    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Product-Service');
    console.log('Connected to MongoDB.');

    // Set up routes
    app.use('/api/product', productRoutes);

    // Start server
    app.listen(env.PORT, () => {
        console.log(`Product Service is running on port ${env.PORT}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down Product Service...');
        await container.get(ProductService).disconnect();
        await mongoose.connection.close();
        process.exit();
    });
}

startService();
 
import 'reflect-metadata';
import { NotificationService } from './services/NotificationService';

async function startService() {
    console.log('Starting Notification Service...');
    const notificationService = new NotificationService();

    // Graceful shutdown on exit
    process.on('SIGINT', async () => {
        console.log('Shutting down Notification Service...');
        await notificationService.disconnect();
        process.exit();
    });
}

startService();

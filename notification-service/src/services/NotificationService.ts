import { Kafka } from 'kafkajs';
import { injectable } from 'inversify';
import { INotificationService } from '../interfaces/INotificationService';
import nodemailer from 'nodemailer';
import { env } from '../config/env';

@injectable()
export class NotificationService implements INotificationService {
    private kafka;
    private consumer;
    private transporter;

    constructor() {
        console.log('Initializing Kafka for NotificationService...');
        this.kafka = new Kafka({
            clientId: 'notification-service',
            brokers: ['localhost:9092'],
        });

        this.consumer = this.kafka.consumer({ groupId: 'notification-group' });
        this.initializeKafka();

        // Initialize Nodemailer transporter
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email provider
            auth: {
                user: env.EMAIL_USER, // Your email
                pass: env.EMAIL_PASS, // Your email password
            },
        });
    }

    private async initializeKafka() {
        try {
            console.log('Connecting Kafka consumer for NotificationService...');
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: 'user-registration', fromBeginning: true });
            console.log('Subscribed to user-registration topic.');

            this.consumer.run({
                eachMessage: async ({ message }) => {
                    const userDetails = JSON.parse(message.value?.toString() || '{}');
                    console.log('Received user registration event:', userDetails);

                    // Send a welcome notification
                    this.sendWelcomeNotification(userDetails);
                },
            });
        } catch (error) {
            console.error('Error initializing Kafka consumer:', error);
        }
    }

    // Method to send a welcome notification
    async sendWelcomeNotification(userDetails: { userId: string; name: string; email: string }) {
        const mailOptions = {
            from: 'abhishekabtr@gmail.com',
            to: userDetails.email,
            subject: 'Welcome to Our Service!',
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h2 style="color: #4CAF50;">Welcome, ${userDetails.name}!</h2>
                <p>Thank you for registering with us. We're excited to have you on board!</p>
                <p style="margin: 20px 0;">This is a demo mini e-commerce project built on microservices using complete asynchronous calls. Explore the code and get in touch with the developer if you have any queries. Here are the services included in this project:</p>
                <ul>
                    <li><strong>User Service:</strong> Manages user authentication and profile management.</li>
                    <li><strong>Product Service:</strong> Handles product listings, details, and management.</li>
                    <li><strong>Cart Service:</strong> Manages the shopping cart functionalities for users.</li>
                    <li><strong>Notifications Service:</strong> Sends notifications to users regarding updates and promotions.</li>
                    <li><strong>API Gateway:</strong> Acts as a single entry point for all client requests, routing them to the appropriate services.</li>
                </ul>
                <p>Happy exploring!</p>
                <p>Best Regards,<br/>The Team</p>
                <footer style="margin-top: 20px; font-size: 12px; color: #aaa;">
                    <p>This is a project built for practicing the power of microservices and their wide range of scalability options.</p>
                    <p>Check the full project from <a href="https://github.com/abhiabhishektr/ecommerce-microservices">here</a>.</p>
                    <p>Follow the developer on <a href="https://www.linkedin.com/in/abhiabhishektr/">LinkedIn</a>.</p>
                    <p>GitHub: <a href="https://github.com/abhiabhishektr/">here</a>.</p>
                </footer>
            </div>

            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome notification sent to ${userDetails.name} (${userDetails.email})`);
        } catch (error) {
            console.error('Error sending welcome notification:', error);
        }
    }

    // Graceful shutdown
    async disconnect() {
        try {
            console.log('Disconnecting Kafka consumer...');
            await this.consumer.disconnect();
            console.log('Consumer disconnected successfully.');
        } catch (error) {
            console.error('Error disconnecting Kafka consumer:', error);
        }
    }
}
 
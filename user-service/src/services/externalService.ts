import { Kafka } from 'kafkajs';
import { injectable } from 'inversify';
import { env } from '../config/env';

@injectable()
export class ExternalService {
    private kafka;
    private producer;
    private consumer;

    constructor() {
        console.log('Initializing Kafka service...');
        this.kafka = new Kafka({
            clientId: env.SERVICE,
            brokers: [env.KAFKA_BROKER_URL || 'localhost:9092'],
        });

        console.log('Creating Kafka producer and consumer...');
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: `${env.SERVICE}-group` }); 

        this.initializeKafka();
    }

    private async initializeKafka() {
        try {
            console.log('Connecting Kafka producer...');
            await this.producer.connect();
            console.log('Producer connected successfully.');

            console.log('Connecting Kafka consumer...');
            await this.consumer.connect();
            console.log('Consumer connected successfully.');
        } catch (error) {
            console.error('Error initializing Kafka:', error);
            // Consider more robust error handling (e.g., retries or process exit)
        }
    }

    async sendMessage(topic: string, message: any): Promise<void> {
        console.log(`Preparing to send message to topic: ${topic}`);
        try {
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }],
            });
            console.log(`Message sent to topic ${topic}:`, message);
        } catch (error) {
            console.error(`Error sending message to Kafka topic ${topic}:`, error.message);
            throw new Error(`Error sending message to Kafka: ${error.message}`); 
        }
    }

    async consumeMessages(topic: string, callback: (message: any) => void): Promise<void> {
        console.log(`Subscribing to Kafka topic: ${topic}`);
        try {
            await this.consumer.subscribe({ topic, fromBeginning: true });
            console.log(`Subscribed to topic: ${topic}`);

            console.log('Starting to consume messages...');
            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    try { 
                        const parsedMessage = JSON.parse(message.value?.toString() || '{}');
                        console.log('Message consumed:', parsedMessage);
                        callback(parsedMessage);
                    } catch (parsingError) {
                        console.error('Error parsing Kafka message:', parsingError);
                        // Handle parsing errors (e.g., logging, skipping the message)
                    }
                },
            });
        } catch (error) {
            console.error(`Error consuming messages from Kafka topic ${topic}:`, error.message);
            throw new Error(`Error consuming messages from Kafka: ${error.message}`); 
        }
    }

    // Graceful Shutdown
    async disconnect() {
        try {
            console.log('Disconnecting Kafka producer...');
            await this.producer.disconnect();
            console.log('Producer disconnected successfully.');

            console.log('Disconnecting Kafka consumer...');
            await this.consumer.disconnect();
            console.log('Consumer disconnected successfully.');
        } catch (error) {
            console.error('Error disconnecting from Kafka:', error);
        }
    }
}
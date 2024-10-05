// cart-service/src/services/ExternalService.ts
import { Kafka } from 'kafkajs';
import { injectable } from 'inversify';
import { env } from '../config/env';

@injectable()
export class ExternalService {
    private kafka: Kafka;
    private producer;
    private consumer;

    constructor() {
        this.kafka = new Kafka({
            clientId: env.SERVICE,
            brokers: [env.KAFKA_BROKER_URL || 'localhost:9092'],
        });

        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: `${env.SERVICE}-group` });

        this.initializeKafka();
    }

    private async initializeKafka() {
        try {
            await Promise.all([
                this.producer.connect(),
                this.consumer.connect(),
            ]);
        } catch (error) {
            console.error('Failed to connect to Kafka', error);
        }
    }

    async sendMessage(topic: string, message: any): Promise<void> {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }

    async consumeMessages(topic: string, callback: (message: any) => void): Promise<void> {
        await this.consumer.subscribe({ topic, fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const parsedMessage = JSON.parse(message.value?.toString() || '{}');
                callback(parsedMessage);
            },
        });
    }

    async disconnect() {
        await Promise.all([
            this.producer.disconnect(),
            this.consumer.disconnect(),
        ]);
    }
}

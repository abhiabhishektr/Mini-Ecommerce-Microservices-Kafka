export interface IExternalService {
    sendMessage(topic: string, message: any): Promise<void>;
    consumeMessages(topic: string, callback: (message: any) => void): Promise<void>;
    disconnect(): Promise<void>;
}
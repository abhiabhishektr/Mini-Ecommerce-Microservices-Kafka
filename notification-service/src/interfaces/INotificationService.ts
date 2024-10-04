export interface INotificationService {
    sendWelcomeNotification(userDetails: { userId: string, name: string, email: string }): void;
}

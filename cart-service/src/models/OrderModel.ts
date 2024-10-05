import { Schema, model, Document } from 'mongoose';

interface IOrderItem {
    productId: string;
    quantity: number;
}

export interface IOrder extends Document {
    userId: string;
    cartId: string;
    items: IOrderItem[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    cartId: { type: String, required: true },
    items: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered','unverified'], default: 'pending' },
}, {
    timestamps: true,
});

export const OrderModel = model<IOrder>('Order', OrderSchema);

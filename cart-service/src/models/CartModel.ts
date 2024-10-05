import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
    items: { productId: string; quantity: number }[];
}

const CartSchema: Schema<ICart> = new Schema({
    items: [{ productId: { type: String, required: true }, quantity: { type: Number, required: true } }],
});

export const CartModel = mongoose.model<ICart>('Cart', CartSchema);

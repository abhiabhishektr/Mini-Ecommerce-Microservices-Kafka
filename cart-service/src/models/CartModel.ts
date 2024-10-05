import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
    userId: string;
    items: { productId: string; quantity: number }[];
}

const CartSchema: Schema<ICart> = new Schema({
    userId: { type: String, required: true }, // Add this field to track whose cart it is
    items: [
      { productId: { type: String, required: true }, quantity: { type: Number, required: true } }
    ],
  });
  

export const CartModel = mongoose.model<ICart>('Cart', CartSchema);

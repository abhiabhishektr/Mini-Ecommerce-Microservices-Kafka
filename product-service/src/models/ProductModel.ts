import mongoose, { Document, Schema } from "mongoose";

export interface IProductModel extends Document {
    name: string;
    price: number;
    description: string;
    quantity: number;
    averageRating: number; 
    reviewCount: number; 
    isActive: boolean;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }, 
    isActive: { type: Boolean, default: true },
});

export default mongoose.model<IProductModel>("Product", ProductSchema);

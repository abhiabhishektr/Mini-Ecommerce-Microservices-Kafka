import mongoose, { Document, Schema } from "mongoose";

export interface IProductModel extends Document {
    name: string;
    price: number;
    description: string;
    quantity: number;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
});

export default mongoose.model<IProductModel>("Product", ProductSchema);

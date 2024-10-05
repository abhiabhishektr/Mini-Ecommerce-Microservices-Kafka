// src/models/ReviewModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IReviewModel extends Document {
    productId: string;
    userId: string;    
    rating: number;
    comment: string;
}

const ReviewSchema: Schema = new Schema({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, {
    timestamps: true, 
});

export default mongoose.model<IReviewModel>("Review", ReviewSchema);

// src/interfaces/IProductService.ts
import { IProductModel } from '../models/ProductModel';

export interface IProductService {
    createProduct(productData: { name: string; price: number; description: string; quantity: number }): Promise<IProductModel>;
    updateProduct(productId: string, productData: { name?: string; price?: number; description?: string; quantity?: number }): Promise<IProductModel | null>;
    handleReview(reviewData: { productId: string; rating: number; comment: string; userId: string }): Promise<void>; 
    getProductById(productId: string): Promise<IProductModel | null>;  
    getAllProducts(): Promise<IProductModel[]>; 
}

import { IProductModel } from '../models/ProductModel';

export interface IProductService {
    createProduct(productData: { name: string; price: number; description: string; quantity: number }): Promise<IProductModel>;
    updateProduct(productId: string, productData: { name?: string; price?: number; description?: string; quantity?: number }): Promise<IProductModel | null>;
}

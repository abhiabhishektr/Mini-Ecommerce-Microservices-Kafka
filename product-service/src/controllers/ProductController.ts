import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IProductService } from '../interfaces/IProductService';
import { TYPES } from '../types';

@injectable()
export class ProductController {
    constructor(
        @inject(TYPES.IProductService) private productService: IProductService
    ) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const productData = req.body;
            const product = await this.productService.createProduct(productData);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params;
            const productData = req.body;
            const updatedProduct = await this.productService.updateProduct(productId, productData);
            if (!updatedProduct) {
                res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const { productId } = req.params;
            const product = await this.productService.getProductById(productId);
            if (!product) {
                res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

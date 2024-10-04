import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { container } from '../inversify.config';  // Import container

const router = Router();
const productController = container.get(ProductController);

router.post('/products', productController.create.bind(productController));
router.put('/products/:productId', productController.update.bind(productController));

export default router;

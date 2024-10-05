// cart-service/src/inversify.config.ts
import { Container } from 'inversify';
import { CartService } from './services/CartService';
import { CartController } from './controllers/CartController';

const container = new Container();
container.bind('IControllers').to(CartController);
container.bind('ICartService').to(CartService);

export { container };

import { Container } from 'inversify';
import { CartService } from './services/CartService';
import { CartController } from './controllers/CartController';
import { ExternalService } from './services/ExternalService';
import { ICartService } from './interfaces/ICartService';
import { IExternalService } from './interfaces/IExternalService';
import { IControllers } from './interfaces/IControllers';

const container = new Container();

container.bind<IControllers>('IControllers').to(CartController);
container.bind<ICartService>('ICartService').to(CartService);
container.bind<IExternalService>('IExternalService').to(ExternalService);

export { container };
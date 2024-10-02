// user-service/src/inversify.config.ts
import { Container } from "inversify";
import { UserRepository } from "./repositories/UserRepository";
import { UserUseCase } from "./useCase/user.useCase";
import { UserController } from "./controllers/user.controller";
import { IUserRepository } from "./interfaces/IUserRepository";
import { IUserUseCase } from "./interfaces/IUserUseCase";
import { ExternalService } from "./services/externalService";

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository);
container.bind<IUserUseCase>("IUserUseCase").to(UserUseCase);
container.bind<UserController>(UserController).toSelf();
container.bind<ExternalService>("ExternalService").to(ExternalService);
export default container;


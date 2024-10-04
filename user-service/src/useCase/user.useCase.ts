// user-service/src/useCase/user.useCase.ts
import { injectable, inject } from "inversify";
import { IUserUseCase } from "../interfaces/IUserUseCase";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserModel } from "../models/UserModel";
import bcrypt from "bcrypt";
import { JwtService } from "../services/jwtService";
import { ExternalService } from "../services/externalService";

@injectable()
export class UserUseCase implements IUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("ExternalService") private externalService: ExternalService
    ) {}

    async register(userData: Partial<IUserModel>): Promise<IUserModel> {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password as string, salt);
    
        const user = await this.userRepository.createUser(userData);
        // Use externalService to send Kafka message
        await this.externalService.sendMessage('user-registration', {
             userId: user.id,
             email: user.email,
             name : user.name
            });
    
        return user;
    }
    

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return JwtService.generateToken(user.id);
    }
}

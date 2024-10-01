import { injectable, inject } from "inversify";
import { IUserUseCase } from "../interfaces/IUserUseCase";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserModel } from "../models/UserModel";
import bcrypt from "bcrypt";
import { JwtService } from "../services/jwtService";

@injectable()
export class UserUseCase implements IUserUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository
    ) {}

    async register(userData: Partial<IUserModel>): Promise<IUserModel> {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password as string, salt);
        return this.userRepository.createUser(userData);
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return JwtService.generateToken(user.id);
    }
}

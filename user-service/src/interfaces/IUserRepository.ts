// user-service/src/interfaces/IUserRepository.ts
import { IUserModel } from "../models/UserModel";

export interface IUserRepository {
    createUser(userData: Partial<IUserModel>): Promise<IUserModel>;
    findUserByEmail(email: string): Promise<IUserModel | null>;
}

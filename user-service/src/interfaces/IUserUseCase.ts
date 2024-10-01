import { IUserModel } from "../models/UserModel";

export interface IUserUseCase {
    register(userData: Partial<IUserModel>): Promise<IUserModel>;
    login(email: string, password: string): Promise<string>;
}

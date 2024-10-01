// user-service/src/repositories/UserRepository.ts
import { injectable } from "inversify"; // Import the injectable decorator
import UserModel, { IUserModel } from "../models/UserModel";
import { IUserRepository } from "../interfaces/IUserRepository";

@injectable() // Add the injectable decorator here
export class UserRepository implements IUserRepository {
    async createUser(userData: Partial<IUserModel>): Promise<IUserModel> {
        const user = new UserModel(userData);
        return user.save();
    }

    async findUserByEmail(email: string): Promise<IUserModel | null> {
        return UserModel.findOne({ email });
    }
}

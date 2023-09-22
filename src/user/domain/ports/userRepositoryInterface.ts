import InputRegisterUser from '../models/inputRegisterUser';
import User from '../models/User';
import InputLoginUser from "../models/inputLoginUser";

export default interface UserRepositoryInterface {
    create(input: InputRegisterUser): Promise<User>;
    getByEmail(email: string): Promise<User | User & {password: string}>;
}

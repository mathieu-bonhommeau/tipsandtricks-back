import InputRegisterUser from '../models/inputRegisterUser';
import User from '../models/User';

export default interface UserRepositoryInterface {
    create(input: InputRegisterUser): Promise<User>;
    getByEmail(email: string): Promise<User & { password?: string }>;
    getByUsername(username: string): Promise<User>;
}

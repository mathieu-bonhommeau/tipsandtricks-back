import InputUserData from '../models/inputUserData';
import User from '../models/User';

export default interface UserRepositoryInterface {
    create(input: InputUserData): Promise<User>;
}

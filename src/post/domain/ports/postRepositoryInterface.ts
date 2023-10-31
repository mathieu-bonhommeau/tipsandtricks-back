import Post from '../model/post';
import InputCreatePost from "../model/inputCreatePost";
import User from '../../../user/domain/models/User';

export default interface PostRepositoryInterface {
    getList(start: number, length: number): Promise<Post[]>;
    create(input: InputCreatePost): Promise<Post>;
    getList(start: number, length: number, user: User | null): Promise<Post[]>;
}

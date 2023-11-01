import Post from '../model/post';
import User from '../../../user/domain/models/User';

export default interface PostRepositoryInterface {
    getList(start: number, length: number, user: User | null): Promise<Post[]>;
}

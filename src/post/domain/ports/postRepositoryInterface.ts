import Post, { PostFullData } from '../model/post';
import InputCreatePost from '../model/inputCreatePost';

export default interface PostRepositoryInterface {
    getPost(postId: number): Promise<Post | null>;
    getList(start: number, length: number): Promise<PostFullData[]>;
    create(input: InputCreatePost & { slug: string }): Promise<Post>;
}

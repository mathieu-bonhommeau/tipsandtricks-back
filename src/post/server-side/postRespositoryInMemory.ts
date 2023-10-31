import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post from '../domain/model/post';
import InputCreatePost from "../domain/model/inputCreatePost";

export default class PostRepositoryInMemory implements PostRepositoryInterface {
    public postInMemory: Array<Post> = [];
    private _error: boolean = false;

    async getList(start: number, length: number): Promise<Post[]> {
        return this.postInMemory.slice(start, start + length);
    }

    async create(input: InputCreatePost): Promise<Post> {
        if (!this._error) {
            return new Post(
                1,
                input.user_id,
                input.title,
                input.slug,
                input.description,
                input.message,
                input.command,
                'Pseudo',
                new Date('2022-12-17T03:24:00'),
                new Date('2022-12-17T03:24:00'),
                null
            )
        }
        throw new Error('Server error')
    }

    setPost(post: Post): PostRepositoryInMemory {
        this.postInMemory.push(post);
        return this;
    }

    setError(): PostRepositoryInMemory {
        this._error = true;
        return this;
    }

    clear(): PostRepositoryInMemory {
        this.postInMemory = [];
        return this;
    }
}

import PostRepositoryInterface from '../domain/ports/postRepositoryInterface';
import Post from '../domain/model/post';

export default class PostRepositoryInMemory implements PostRepositoryInterface {
    public postInMemory: Array<Post> = [];
    private _error: boolean = false;

    async getList(start: number, length: number): Promise<Post[]> {
        return this.postInMemory.slice(start, start + length);
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

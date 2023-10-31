import Post from '../model/post';
import PostRepositoryInterface from '../ports/postRepositoryInterface';
import ParamError from '../../../_common/domain/errors/paramError';

export interface GetPostUseCaseInterface {
    getPost(postId: number): Promise<Post | null>;
}

export default class GetPostUseCase implements GetPostUseCaseInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async getPost(postId: number): Promise<Post | null> {
        const post = await this._postRepository.getPost(postId);

        if (!post) throw new ParamError('Get post failed !');

        return post;
    }
}

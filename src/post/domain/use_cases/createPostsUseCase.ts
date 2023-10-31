import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
import InputCreatePost from "../model/inputCreatePost";
import Post from "../model/post";
import PostRepositoryInterface from "../ports/postRepositoryInterface";
dotenv.config();
const logger = debug('tipsandtricks:registerUserUseCase');

export interface CreatePostRepositoryInterface {
    create(input: InputCreatePost): Promise<Post>;
}

export default class CreatePostUseCase implements CreatePostRepositoryInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async create(input: InputCreatePost): Promise<Post> {
        try {
            return await this._postRepository.create(input);
        } catch (error) {
            logger('post creation error');
            throw new InputError('Create post failed !');
        }
    }
}

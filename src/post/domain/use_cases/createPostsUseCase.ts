import * as dotenv from 'dotenv';
import InputError from '../../../_common/domain/errors/inputError';
import debug from 'debug';
import InputCreatePost from "../model/inputCreatePost";
import Post from "../model/post";
import PostRepositoryInterface from "../ports/postRepositoryInterface";
import urlSlug from "url-slug";
dotenv.config();
const logger = debug('tipsandtricks:CreatePostUseCase');

export interface CreatePostRepositoryInterface {
    create(input: InputCreatePost): Promise<Post>;
}

export default class CreatePostUseCase implements CreatePostRepositoryInterface {
    constructor(private readonly _postRepository: PostRepositoryInterface) {}

    async create(input: InputCreatePost): Promise<Post> {
           const newPost = await this._postRepository.create({...input, slug: urlSlug(input.title)});
           if (!newPost) {
               throw new InputError('Create post failed !');
           }
           return newPost;
    }
}

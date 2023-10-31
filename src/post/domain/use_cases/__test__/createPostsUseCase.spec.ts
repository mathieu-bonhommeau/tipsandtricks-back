import {faker} from "@faker-js/faker";
import InputCreatePost from "../../model/inputCreatePost";
import PostTestBuilder from "./PostTestBuilder";
import PostRepositoryInMemory from "../../../server-side/postRespositoryInMemory";
import Post from "../../model/post";
import CreatePostUseCase from "../createPostsUseCase";

describe('Create a post', () => {
    let postRepository: PostRepositoryInMemory;
    let sut: SUT;

    beforeEach(() => {
        postRepository = new PostRepositoryInMemory();
        sut = new SUT(postRepository);
    });

    afterEach(() => {
        postRepository.clear();
    });

    test('can create a new post', async () => {
        const inputCreatePost = sut.givenAnInputCreatePost();
        const expectedPost = sut.givenACreatedPost(inputCreatePost);

        const postCreated = await new CreatePostUseCase(postRepository).create(inputCreatePost);

        expect(postCreated).toEqual(expectedPost);
    });

});

class SUT {
    private _postTestBuilder: PostTestBuilder;
    constructor(private readonly _postRepositoryInMemory: PostRepositoryInMemory) {
        this._postTestBuilder = new PostTestBuilder();
    }

    givenAnInputCreatePost(): InputCreatePost {
        return {
            user_id: 3,
            message: faker.lorem.paragraph({min: 1, max: 2}),
            title: faker.lorem.words({min:1, max: 3}),
            slug: faker.lorem.slug({min:1, max: 3}),
            description: faker.lorem.paragraph({min: 1, max: 2}),
            command: faker.lorem.words({min:1, max: 3}),
            username: faker.internet.userName()
        };

    }

    givenACreatedPost(input: InputCreatePost): Post {
       return this._postTestBuilder
            .withId(1)
            .withTitle(input.title)
            .withSlug(input.slug)
            .withUserId(3)
            .withCommand(input.command)
            .withDescription(input.description)
            .withMessage(input.message)
            .withUsername(input.username)
            .buildPost();
    }

/*    givenAnError(): PostRepositoryInMemory {
        return this._postRepositoryInMemory.setError();
    }*/

/*    givenAnInputTipsWithBadInputFormat(): InputCreateTips {
        this._tipsTestBuilder.withTitle('');
        return this._tipsTestBuilder.buildInputCreateTips();
    }*/
}
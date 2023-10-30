import Post from "../model/post";

export default interface PostRepositoryInterface {
    getList(start: number, length: number): Promise<Post[]>;
}
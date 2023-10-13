import Tips from '../models/Tips';
import InputTips from '../models/inputTips';

export type TipsList = {
    tips: Tips[];
    total: number;
};

export default interface TipsRepositoryInterface {
    getList(userId: number, page: number, length: number): Promise<TipsList>;
    create(input: InputTips): Promise<Tips>;
}

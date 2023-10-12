import Tips from '../models/Tips';

export type TipsList = {
    tips: Tips[];
    total: number;
};

export default interface TipsRepositoryInterface {
    getList(page: number, length: number): Promise<TipsList>;
}

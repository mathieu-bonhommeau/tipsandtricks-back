import {Sql} from "postgres";
import {faker} from "@faker-js/faker";
import InputTips from "../../../tips/domain/models/inputTips";

export default class TipsFixtures {
    constructor(private readonly _sql : Sql) {
    }

    public async givenSomeTips(count: number) {
        const tips: InputTips[] = []

        const usersIds = await this._sql`select "id" from "user"`.then(rows => rows)

        while(count--) {
            tips.push(
                new InputTips(
                    faker.lorem.words(3),
                    faker.lorem.words(5),
                    faker.lorem.text(),
                    usersIds[Math.floor(Math.random() * usersIds.length)].id
                )
            )
        }

        await this._sql`insert into "tips" ${this._sql(tips)}`.then((rows) => rows.length)
    }
}
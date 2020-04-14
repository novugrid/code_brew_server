import { Model } from "sequelize-typescript";

export class GenericStunt{

    async performModelStunt<T extends Model<T>>(model: NonAbstractTypeOfModel<T>): Promise<T[]> {
        return await model.findAll<T>()
    }
}

type NonAbstract<T> = {[P in keyof T]: T[P]}
type Constructor<T> = (new () => T)
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;
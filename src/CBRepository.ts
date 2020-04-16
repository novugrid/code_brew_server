import { Model } from 'sequelize-typescript';
import { NonAbstractTypeOfModel } from './onboarding/OnBoarding';

export class CBRepository<T extends Model<T>> {

    constructor(model: NonAbstractTypeOfModel<T>) {
        this.model = model
    }

    model!: NonAbstractTypeOfModel<T>


    public async paginate() {
        var res = new PaginationResponse()
    }
} 

export class PaginationResponse {
    total!: number
    total_pages!: number
    current_page!: number
    previous_page!: number
    next_page!: number
    limit!: number
    data: any
}
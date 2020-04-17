import { Model,  } from 'sequelize-typescript';
import { NonAbstractTypeOfModel } from './onboarding/OnBoarding';
import express from 'express';
import { WhereOptions, Includeable } from 'sequelize/types';

export class CBRepository<T extends Model<T>> {

    constructor(model: NonAbstractTypeOfModel<T>) {
        this.model = model
    }

    model!: NonAbstractTypeOfModel<T>


    public async paginate(req: express.Request, where: WhereOptions, 
        includeAble: Includeable[], order: []) {
        var res = new PaginationResponse()
        let page = 1;
        let pageSize = 20;
        if (req.query.page) {
            page = Number(req.query.page);
        }
        if (req.query.limit) { pageSize = Number(req.query.limit); }
        const nOffset  = pageSize * (page - 1);
        try {
            const result = await this.model.findAndCountAll({
                where: where,
                include: includeAble,
                offset: nOffset,
                limit: pageSize,
                order: order
            })
            res.total_pages = result.count / pageSize
            res.current_page = page
            res.data = result.rows
            res.limit = pageSize
            res.previous_page = page == 1 ? 1 : (page - 1)
            res.next_page = page == res.total_pages ? res.total_pages : (page + 1)
            return res;
        } catch(err) {
            console.log("error whule performing pagination", err)
        }
    }
} 

export class PaginationResponse {
    total!: number
    total_pages!: number
    current_page!: number
    previous_page?: number
    next_page!: number
    limit!: number
    data: any
}
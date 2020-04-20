import { Model,  } from 'sequelize-typescript';
import { NonAbstractTypeOfModel } from './onboarding/OnBoarding';
import express from 'express';
import { WhereOptions, Includeable } from 'sequelize/types';

export class CBRepository<T extends Model<T>> {

    constructor(model: NonAbstractTypeOfModel<T>) {
        this.model = model
    }

    model!: NonAbstractTypeOfModel<T>


    /**
     * 
     * @param req express request
     * @param where : optionally include a where option for the query
     * @param includeAble : model or association attached to the model (optional)
     *                      Note when adding your includable model kindly set separate parameter of 
     *                      each model to true so the count wont affect the total count of the result
     * @param order : sorting order 
     */
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
            res.total = result.count
            res.total_pages = Math.ceil(result.count / pageSize)
            res.current_page = page
            res.limit = pageSize
            //res.previous_page = page == 1 ? 0 : (page - 1)
            res.previous_page = (page - 1)
            res.next_page = page == res.total_pages ? res.total_pages : (page + 1)
            res.data = result.rows
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
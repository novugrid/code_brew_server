import { Model,  } from 'sequelize-typescript';
import { NonAbstractTypeOfModel } from './onboarding/OnBoarding';
import express from 'express';
import { WhereOptions, Includeable, OrderItem } from 'sequelize/types';

export class CBRepository<T extends Model<T>> {

    constructor(model: NonAbstractTypeOfModel<T>) {
        this.model = model
    }

    model!: NonAbstractTypeOfModel<T>;


    /**
     *
     * @param reqPage request page
     * @param reqLimit request limit
     * @param where optionally include a where option for the query
     * @param includeAble : model or association attached to the model (optional)
     *                      Note when adding your includable model kindly set separate parameter of
     *                      each model to true so the count wont affect the total count of the result
     * @param order - sorting order
     */
    public async paginate(reqPage: number, reqLimit: number, where: WhereOptions,
        includeAble: Includeable[], order: OrderItem[]) {
        var res = new PaginationResponse<T>();
        let page = 1;
        let pageSize = 20;
        if (reqPage) {
            page = Number(reqPage);
        }
        if (reqLimit) { pageSize = Number(reqLimit); }
        const nOffset  = pageSize * (page - 1);
        try {
            const result = await this.model.findAndCountAll({
                where: where,
                include: includeAble,
                offset: nOffset,
                limit: pageSize,
                order: order
            });
            res.total = result.count;
            res.total_pages = Math.ceil(result.count / pageSize);
            res.current_page = page;
            res.limit = pageSize;
            //res.previous_page = page == 1 ? 0 : (page - 1)
            res.previous_page = (page - 1);
            res.next_page = page == res.total_pages ? res.total_pages : (page + 1);
            res.data = result.rows;
            return res;
        } catch(err) {
            console.log("error while performing pagination", err);
            throw err;
        }
    }

    public static paginateData<M extends Model>(data: Array<M>, paginationParam: PaginationParams ): PaginationResponse<M> {

        let result = {} as PaginationResponse<M>;
        result.total = paginationParam.totalDataCount ?? data.length;
        result.total_pages = Math.ceil(result.total / data.length);

        result.current_page = paginationParam.currentPage;
        result.limit = paginationParam.currentPageSize;
        //res.previous_page = page == 1 ? 0 : (page - 1)
        result.previous_page = paginationParam.currentPage > 1 ? (paginationParam.currentPage - 1) : 1;

        result.next_page = paginationParam.currentPage == result.total_pages ? result.total_pages : (paginationParam.currentPage + 1);
        result.data = data;
        return result;

    }

} 

export class PaginationResponse<T> {
    total!: number;
    total_pages!: number;
    current_page!: number;
    previous_page?: number;
    next_page!: number;
    limit!: number;
    data!: T[]; // Todo(Lekan) - I suggest we change this to results
}

export interface PaginationParams {
    currentPage: number;
    currentPageSize: number;
    totalDataCount?: number;
    offset?: number;
}

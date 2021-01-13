import {Request} from "express";
import {PaginationParams} from "../CBRepository";

export class CBRequestHelper {

    public static paginationParams(request: Request): PaginationParams {

        let page: number = 1;
        let limit: number = 20;
        if (request.query.page) {
            page = Number(request.query.page);
        }
        if (request.query.limit) {
            limit = Number(request.query.limit);
        }

        let start = limit * (page - 1);

        return {
            currentPage: page,
            currentPageSize: limit,
            offset: start
        } as PaginationParams;

    }

}

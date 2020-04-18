import { ErrorBuilder } from './ErrorBuilder';
import express = require("express");

export class ResponseHelper {

    public success(res: express.Response, data: any, message = "successful", code = 200) {
        return this.buildResponse(res, data, true, message, code);
    }

    public error(res: express.Response, data: ErrorBuilder) {
        return this.buildResponse(res, data, false, data.userMessage, data.statusCode);
    }

    private buildResponse(res: express.Response, data: any, success: boolean, message: string, code: number) {

        if (success) {
            const body = {
                code,
                data,
                message,
                success,
            };
            return res.json(body);
        } else {
            const error = data;
            const body = {
                code,
                error,
                message,
                success,
            };
            return res.status(code).json(body);
        }

    }

}

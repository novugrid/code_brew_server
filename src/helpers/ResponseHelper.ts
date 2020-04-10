import express = require("express");

export class ResponseHelper {

    public success(res: express.Response, data: any, message = "successful", code = 200) {
        return this.buildResponse(res, data, true, message, code);
    }

    /// Todo(lekan): I think the data should be an object type instead of using the any
    public error(res: express.Response, data: any, message = "failed", code = 400) {
        return this.buildResponse(res, data, false, message, code);
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

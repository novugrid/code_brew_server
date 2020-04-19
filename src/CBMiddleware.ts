import express from 'express';
import { validationResult } from 'express-validator';
import { ResponseHelper } from './helpers/ResponseHelper';
import { ErrorBuilder } from './helpers/ErrorBuilder';
import { IncomingHttpHeaders } from 'http';
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";


export class CBMiddleware {

    private static readonly jwtSecret = "0.rfyj3n9nzh";

    static validateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log("validating the request");
        const errors = validationResult(req);
        console.log("error length", errors.array().length);
        if (!errors.isEmpty()) {
            const responseHelper = new ResponseHelper();
            return responseHelper.error(res, new ErrorBuilder("failed validation error").ValidationError(errors.array()))
        }
        console.log("request validated. proceeding with the request");
        next();
    }

    static async validateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
        const token = this.getTokenFromHeaders(req.headers) || req.query.token || req.body.token || "";
        const isValid = await this.verifyToken(token)
        if(!isValid) {
            return new ResponseHelper().error(res, new ErrorBuilder("your session has expired, please login again", 401))
        }
        next();
    }

    static getTokenFromHeaders(headers: IncomingHttpHeaders) {
        const header = headers.authorization as string;
        if (!header) { return header; }
        return header.split(" ")[1];
    }

    static async verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.jwtSecret,  async (err, decoded) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
                return;
            });
        }) as Promise<boolean>;
    }
}
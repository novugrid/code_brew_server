import express from 'express';
import { validationResult } from 'express-validator';
import { ResponseHelper } from './helpers/ResponseHelper';
import { ErrorBuilder } from './helpers/ErrorBuilder';
import { IncomingHttpHeaders } from 'http';
import * as jwt from "jsonwebtoken";
import { OnBoardingModel } from './onboarding/Model';


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
        const token = CBMiddleware.getTokenFromHeaders(req.headers) || req.query.token || req.body.token || "";
        const isValid = await CBMiddleware.verifyToken(token)
        if (!isValid) {
            return new ResponseHelper().error(res, new ErrorBuilder("Invalid authorisation token", 401))
        }
        next();
    }

    private static getTokenFromHeaders(headers: IncomingHttpHeaders) {
        try {
            const header = headers.authorization as string;
            if (!header) { return header; }
            return header.split(" ")[1];
        }catch(err) {
            console.log("unable to get token: ", err)
            return ""
        }
    }

    private static async verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY ?? CBMiddleware.jwtSecret, async (err, decoded) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
                return;
            });
        }) as Promise<boolean>;
    }

    public static async getTokenData(req: express.Request) {
        try {
            const token = CBMiddleware.getTokenFromHeaders(req.headers) || req.query.token || req.body.token || "";
            return new Promise((resolve, reject) => {
                jwt.verify(token, CBMiddleware.jwtSecret, async (err: any, decoded: any) => {
                    resolve(decoded);
                    return;
                });
            }) as Promise<OnBoardingModel>;
        }catch (err) {
            console.log("error while getting token data:", err)
        }
    }
}

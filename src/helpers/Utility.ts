import express from "express"
import { validationResult } from "express-validator";
import { ResponseHelper } from './ResponseHelper';
import { ErrorBuilder } from './ErrorBuilder';

export enum LoginType {
    FACEBOOK = "facebook",
    GOOGLE = "google",
    EMAIL_N_PASSWORD = "email_and_password",
    TWITTER = "twitter",
    LINKEDLN = "linkedld",
    GITHUB = "github"
}

export class CBUtility {

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

    static paginate(page: number, pageSize: number) {
        const offset = pageSize + page;
        const limit = offset + pageSize;
        return { offset, limit };
    }

    public static generateToken(length: number) {
        let result = "";
        const characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
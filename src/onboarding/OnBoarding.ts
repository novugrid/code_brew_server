import { OnBoardingModel } from './Model';
import { SocialLoginInteface, OnBoardingResponse } from './Interface';
import { OnBoardingRepository } from './Repositoty';
import * as jwt from "jsonwebtoken";
import { Model } from 'sequelize-typescript';

export class OnBoardingHelper<T extends OnBoardingRepository<U>, U extends OnBoardingModel> {

    private repository: T
    private readonly saltRounds = 12;
    private readonly jwtSecret = "0.rfyj3n9nzh";

    constructor(repository: T) {
        this.repository = repository
    }


    public async performSocialLogin(params: SocialLoginInteface): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        var data: OnBoardingModel
        try {
            const exist = await this.repository.userExist(params.email);
            if (exist && exist.login_type != params.login_type) {
                console.error("invalid login type", exist)
                response.message = "please use a valid login type"
            } else if (exist) {
                console.error("valid login type and record exists", exist)
                response.data = exist
                response.success = true;
                response.message = "user logged in successfully"
                response.token = await this.generateToken(exist)
            } else {
                data = await this.repository.createUser({
                    email: params.email,
                    user_name: params.user_name,
                    login_type: params.login_type
                });
                response.success = true;
                response.data = data
                response.message = "user registered successfully"
                response.token = await this.generateToken(data)
                console.log("new user created ", data)
            }
        } catch (err) {
            console.error("error performing socail login", err)
        }
        return response
    }

    public verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.jwtSecret, async (err: any, decoded: any) => {
                if (err) {
                    resolve({ success: false, id: 0 });
                    return;
                }
                const id = (decoded as any).id;
                resolve({ success: true, id: id });
                return;
            });
        }) as Promise<{ success: boolean, id: number }>;
    }

    public async generateToken(model: OnBoardingModel): Promise<string> {
        return await jwt.sign({ id: model.id, email: model.email }, this.jwtSecret);
    }
}
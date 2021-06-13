import {OnBoardingModel, OTPTokenModel} from './Model';
import {
    OnBoardingResponse,
    LoginRequestParams,
    ResetPasswordRequestParams,
    ChangePasswordRequestParams,
    RegisterRequestParams, TokenVerificationParam
} from './Interface';
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {Model} from 'sequelize-typescript';
import {SocialLoginRequestParams} from './Interface';
import {LoginType, CBUtility} from '..';
import {Emailer} from '..';
import {OAuth2Client} from "google-auth-library";
import VerifyAppleToken from 'verify-apple-id-token';

type NonAbstract<T> = { [P in keyof T]: T[P] }
type Constructor<T> = (new () => T)
export type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

export class CBOnBoarding<T extends Model<T>> {

    private readonly saltRounds = 12;
    private readonly jwtSecret = "0.rfyj3n9nzh";
    model!: NonAbstractTypeOfModel<T>;

    constructor(model: NonAbstractTypeOfModel<T>) {
        this.model = model
    }


    public async socialLogin(
        params: SocialLoginRequestParams): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        var data: OnBoardingModel;
        try {
            const record = await this.model.findOne({
                where: {email: params.email}
            });
            const existingUser = record as OnBoardingModel;
            if (existingUser && existingUser.login_type != params.login_type) {
                //Todo we need to review this for other social login types
                response.message = "This record currently exist, kindly use Email and password to login";
                return response;
            } else if (existingUser) {
                data = existingUser;
                response.message = "user logged in successfully";
            } else {
                data = await this.model.create({
                    email: params.email,
                    user_name: params.user_name,
                    login_type: params.login_type
                });
                response.message = "user registered successfully";
                response.isExistingUser = false;
            }
            response.success = true;
            response.data = data;
            response.token = await this.generateToken(data);
        } catch (err) {
            console.error("error performing social login", err);
            throw err;
        }
        return response
    }

    public async verifyToken(params: TokenVerificationParam): Promise<boolean> {
        try {
            switch (params.login_type.toLowerCase()) {
                case LoginType.APPLE:
                    return await this.verifyAppleToken(params.client_id, params.token);
                case LoginType.GOOGLE:
                    return await this.verifyGoogleToken(params.client_id, params.token);
                default:
                    return false;
            }
        } catch(e) {
            throw e;
        }
    }

    public async verifyGoogleToken(clientId: string, token: string): Promise<boolean> {
        try {
            let verified = false;
            const client = new OAuth2Client(clientId);
            const ticket = await client.verifyIdToken({idToken: token, audience: clientId});
            const payload = ticket.getPayload();
            if(payload) {
                const userid = payload['sub'];
                verified = true;
            }
            return verified;
        } catch (err) {
            console.error("Error verifying google's token", err);
            throw err;
        }
    }

    public async verifyAppleToken(clientId: string, token: string): Promise<boolean> {
        try {
            let verified = false;
            const jwtClaims = await VerifyAppleToken({
                idToken: token,
                clientId: clientId,
            });
            // todo validate the data inside the jwtclaims....
            if(jwtClaims) {
                verified = true;
            }
            return verified;
        } catch (err) {
            console.error("Error verifying apple's token", err);
            throw err;
        }
    }

    public async register(data: RegisterRequestParams): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        console.info("the user data passed is: ", data)
        try {
            const user = await this.model.findOne({
                where: {email: data.email}
            });
            if (user) {
                response.message = "User with email already exist, please try alternative login"
                return response;
            }
            if (data.password) {
                data.password = await bcrypt.hash(data.password, this.saltRounds)
            }
            response.data = await this.model.create(data);
            response.token = this.generateToken(response.data);
            response.message = "user registered successfully";
            response.success = true;
        } catch (err) {
            console.error("error registering new user ", err);
            throw err;
        }
        return response;
    }

    /**
     *
     * @param params [LoginRequestParams]
     * @param validateLoginType
     * @param modelScope Specify scope to use for querying the model,
     * this is useful when you dont want to expose a password field to the client
     */
    public async login(params: LoginRequestParams, modelScope?: string, validateLoginType: boolean = true): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        try {
            let record = await this.model.scope(modelScope).findOne({
                where: {
                    email: params.email
                }
            });
            if (!record) {
                response.message = "User with email does not exist";
                return response;
            }
            let model = record as OnBoardingModel
            if (validateLoginType && model.login_type != LoginType.EMAIL_N_PASSWORD) {
                response.message = "This record currently exist, kindly use your Google account to login"
                return response;
            }
            const correctPassword = await bcrypt.compare(params.password, model.password!);
            if (!correctPassword) {
                response.message = "incorrect password, please try again later ";
                return response;
            }
            response.data = model;
            response.success = true;
            response.token = this.generateToken(model);
            response.message = "User logged in successfully"

        } catch (err) {
            console.error("error logging in user ", err);
            throw err;
        }
        return response;
    }

    public generateToken(model: OnBoardingModel): string {
        const jwtData = {
            id: model.id,
            email: model.email,
            login_type: model.login_type,
            uuid: model.uuid
        };
        // @ts-ignore
        return jwt.sign(jwtData, process.env.JWT_SECRET_KEY, { algorithm: "HS256"});
    }

    public async initializePasswordReset<T extends Model<T>>(userEmail: string,
                                                             otpModel: NonAbstractTypeOfModel<T>, validateLoginType = true): Promise<OnBoardingResponse> {
        const token = CBUtility.generateToken(6);
        const user = await this.model.findOne({
            where: {email: userEmail},
        });
        var response = new OnBoardingResponse();
        if (user == null) {
            response.message = "user with email does not exist ";
            return response
        }
        let mirroedUser = user as OnBoardingModel
        if (validateLoginType && mirroedUser.login_type != LoginType.EMAIL_N_PASSWORD) {
            response.message = "You cannot reset password for this account.";
            return response
        }

        try {
            await otpModel.create({user_id: user.id, otp: token});
            const mailResponse = await new Emailer().setFromTo(userEmail) // "dammyololade2010@gmail.com, oladosulek@gmail.com")
                .setSubject("Password Reset Request Token")
                .setHtml("<h2>You requested a password reset</h2>" +
                    "<p>Use this token to complete your password reset: <b>" + token + "</b></p>" +
                    "<p><b>This token will expire in the next 2 Hours, " +
                    "Once elapse you will need to request another token</b></p>")
                .send();
            response.message = "an OTp has been sent to your mail"
            response.success = mailResponse
        } catch (e) {
            console.error('error sending otp', e);
            throw e;
        }
        return response;
    }

    public async resetPassword<U extends Model<U>>(requestBody: ResetPasswordRequestParams,
                                                   otpModel: NonAbstractTypeOfModel<U>): Promise<OnBoardingResponse> {
        var user = await this.model.findOne({
            where: {email: requestBody.email},
        });
        var response = new OnBoardingResponse();
        if (user == null) {
            response.message = "user with email does not exist ";
            return response
        }
        try {
            const record = await otpModel.findOne({
                where: {
                    user_id: user.id,
                    otp: requestBody.otp,
                },
            });
            if (record == null) {
                response.message = "OTP reset password not available";
                return response;
            }
            const otpToken = record as OTPTokenModel
            // compare the OTP time
            const sixMinutes = 7200000; // 2 hours // 360000;
            const diffMilliseconds = Date.now() - otpToken.created_on!.getTime();
            if (diffMilliseconds < sixMinutes) {

                if (requestBody.new_password === requestBody.confirm_password) {
                    let password = await bcrypt.hash(requestBody.new_password, this.saltRounds);
                    await user.update({"password": password});
                    response.success = true;
                    response.data = await user.reload()
                    response.message = "password reset successful"
                } else {
                    response.message = "Password must be the same please";
                    return response;
                }
            } else {
                response.message = "OTP Has expired please request another again";
                return response;
            }
        } catch (e) {
            console.error("error while resetting password", e);
        }
        return response;

    }

    public async changePassword(requestBody: ChangePasswordRequestParams, modelScope: string): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        try {
            const user = await this.model.scope(modelScope).findOne({
                where: {
                    id: Number(requestBody.id),
                    email: requestBody.email,
                },
            });
            if (user == null) {
                response.message = "user with email does not exist ";
                return response
            }
            let mirroedUser = user as OnBoardingModel;
            if (mirroedUser.login_type != LoginType.EMAIL_N_PASSWORD) {
                response.message = "you cannot change password for this account.";
                return response
            }
            const correctPassword = await bcrypt.compare(requestBody.old_password, mirroedUser.password!);
            if (!correctPassword) {
                response.message = "Wrong password, please try again later"
                return response;
            }
            const sameAsOldPassword = await bcrypt.compare(requestBody.new_password, mirroedUser.password!);
            if(sameAsOldPassword) {
                response.message = "The new password is the same as the old password, modify the new password and try again.";
                return response
            }
            let newPassword = await bcrypt.hash(requestBody.new_password, this.saltRounds);
            user.update({
                password: newPassword
            });
            response.success = true;
            response.data = user;
            response.message = "user's password changed successfully";
            return response;
        } catch (e) {
            console.error("unable to change user's password", e)
        }
        return response
    }
}

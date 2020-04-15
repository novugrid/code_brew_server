import { OnBoardingModel, OTPTokenModel } from './Model';
import { OnBoardingResponse, LoginRequestParams, ResetPasswordRequestParams, ChangePasswordRequestParams, RegisterRequestParams } from './Interface';
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Model } from 'sequelize-typescript';
import { SocialLoginRequestParams } from '../onboarding/Interface';
import { LoginType, CBUtility } from '../helpers/Utility';
import { Emailer } from '../helpers/Emailer';

type NonAbstract<T> = { [P in keyof T]: T[P] }
type Constructor<T> = (new () => T)
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

export class CBOnBoarding<T extends Model<T>> {

    private readonly saltRounds = 12;
    private readonly jwtSecret = "0.rfyj3n9nzh";
    model!: NonAbstractTypeOfModel<T>

    constructor(model: NonAbstractTypeOfModel<T>) {
        this.model = model
    }


    public async socialLogin(
        params: SocialLoginRequestParams): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        var data: OnBoardingModel
        try {
            const record = await this.model.findOne({
                where: { email: params.email }
            })
            const existingUser = record as OnBoardingModel
            if (existingUser && existingUser.login_type != params.login_type) {
                response.message = "please use a valid login type"
                return response;
            } else if (existingUser) {
                data = existingUser
                response.message = "user logged in successfully"
            } else {
                data = await this.model.create({
                    email: params.email,
                    user_name: params.user_name,
                    login_type: params.login_type
                });
                response.message = "user registered successfully"
            }
            response.success = true;
            response.data = data
            response.token = await this.generateToken(data)
        } catch (err) {
            console.error("error performing socail login", err)
        }
        return response
    }

    public async register(data: RegisterRequestParams): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        console.info("the user data passed is: ", data)
        try {
            const user = await this.model.findOne({
                where: { email: data.email }
            })
            if (user) {
                response.message = "User with email already exist in the system, please try alternative login"
                return response;
            }
            if (data.password) {
                data.password = await bcrypt.hash(data.password, this.saltRounds)
            }
            response.data = await this.model.create(data)
            response.token = this.generateToken(response.data)
            response.message = "user registered successfully"
            response.success = true
        } catch (err) {
            console.error("error registering new user ", err)
        }
        return response;
    }

    /**
     * 
     * @param params [LoginRequestParams]
     */
    public async login(params: LoginRequestParams): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        try {
            let record = await this.model.findOne({
                where: {
                    email: params.email
                }
            })
            if (!record) {
                response.message = "user with email does not exist in the system";
                return response;
            }
            let model = record as OnBoardingModel
            if (model.login_type != LoginType.EMAIL_N_PASSWORD) {
                response.message = "please use a valid login type"
                return response;
            }
            const correctPassword = await bcrypt.compare(params.password, model.password!);
            if (!correctPassword) {
                response.message = "incorrect password, please try again later ";
                return response;
            }
            response.data = model
            response.success = true
            response.token = this.generateToken(model)
            response.message = "User logged in successfully"

        } catch (err) {
            console.error("error logging in user ", err)
        }
        return response;
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

    public generateToken(model: OnBoardingModel): string {
        return jwt.sign({ id: model.id, email: model.email }, this.jwtSecret);
    }

    public async initializePasswordReset<T extends Model<T>>(userEmail: string,
        otpModel: NonAbstractTypeOfModel<T>): Promise<OnBoardingResponse> {
        const token = CBUtility.generateToken(6);
        const user = await this.model.findOne({
            where: { email: userEmail },
        });
        var response = new OnBoardingResponse();
        if (user == null) {
            response.message = "user with email does not exist in the system";
            return response
        }
        let mirroedUser = user as OnBoardingModel
        if (mirroedUser.login_type != LoginType.EMAIL_N_PASSWORD) {
            response.message = "you cannot reset password for this account.";
            return response
        }

        try {
            await otpModel.create({ user_id: user.id, otp: token });
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
            console.error('error sending otp', e)
        }
        return response;
    }

    public async resetPassword<U extends Model<U>>(requestBody: ResetPasswordRequestParams,
        otpModel: NonAbstractTypeOfModel<U>): Promise<OnBoardingResponse> {
        var user = await this.model.findOne({
            where: { email: requestBody.email },
        });
        var response = new OnBoardingResponse();
        if (user == null) {
            response.message = "user with email does not exist in the system";
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
                    await user.update({ "password": password });
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

    public async changePassword(requestBody: ChangePasswordRequestParams): Promise<OnBoardingResponse> {
        var response = new OnBoardingResponse();
        try {
            const user = await this.model.findOne({
                where: {
                    id: Number(requestBody.id),
                    email: requestBody.email,
                },
            });
            if (user == null) {
                response.message = "user with email does not exist in the system";
                return response
            }
            let mirroedUser = user as OnBoardingModel
            if (mirroedUser.login_type != LoginType.EMAIL_N_PASSWORD) {
                response.message = "you cannot change password for this account.";
                return response
            }
            const correctPassword = await bcrypt.compare(requestBody.old_password, mirroedUser.password!);
            if (!correctPassword) {
                response.message = "Wrond password, please try again later"
                return response;
            }
            let newPassword = await bcrypt.hash(requestBody.new_password, this.saltRounds);
            user.update({
                password: newPassword
            });
            response.success = true
            response.data = await user.reload()
            response.message = "user's password changed successfully"
            return response;
        } catch (e) {
            console.error("unable to change user's password", e)
        }
        return response
    }
}
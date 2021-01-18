
export interface SocialLoginRequestParams {
    user_name: string,
    email: string,
    login_type: string,
    token: string,
    client_id: string,
    platform: string,
}

export interface TokenVerificationParam {
    token: string,
    client_id: string,
    login_type: string,
}

export interface LoginRequestParams {
    password: string,
    email: string
}

export class OnBoardingResponse {
    success: boolean;
    message: string;
    data: any;
    token: string;
    isExistingUser: boolean;

    public constructor() {
        this.success = false;
        this.message = "";
        this.data = null;
        this.token = "";
        this.isExistingUser = true;
    }
}

export interface ResetPasswordRequestParams {
    new_password: string;
    confirm_password: string;
    otp: string;
    email: string;
}

export interface ChangePasswordRequestParams {
    old_password: string;
    new_password: string;
    id: string;
    email: string;
}

export class RegisterRequestParams {
    email!: string;
    password!: string
}
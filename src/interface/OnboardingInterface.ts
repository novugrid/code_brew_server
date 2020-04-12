import { OnBoardingModel } from '../model/OnBoardingModel';

export interface SocialLoginInteface {
    user_name: string,
    email: string,
    login_type: string
}

export class OnBoardingResponse {
    success: boolean
    message: string
    data: any
    token: string

    public constructor() {
        this.success = false
        this.message = ""
        this.data = null
        this.token = ""
    }
}
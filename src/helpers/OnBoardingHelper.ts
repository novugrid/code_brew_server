import { OnBoardingModel } from '../model/OnBoardingModel';
import { Model } from 'sequelize-typescript';
import { SocialLoginInteface } from '../interface/OnboardingInterface';

export class OnBoardingHelper<T extends Model> {

    public async performSocialLogin(baseModel: OnBoardingModel<T>, params: SocialLoginInteface) {
        try {
            const existingAccount = OnBoardingModel
        }catch(err) {
            console.error("error performing socail login", err)
        }
    }
}
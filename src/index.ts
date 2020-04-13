import { ErrorBuilder } from './helpers/ErrorBuilder';
import { CBUtility, LoginType } from './helpers/Utility';
import { ResponseHelper } from './helpers/ResponseHelper';
import { onboardingRules } from './onboarding/Rules';
import { OnBoardingModel } from './onboarding/Model';
import { SocialLoginInteface, OnBoardingResponse } from './onboarding/Interface';
import { OnBoardingHelper } from './onboarding/OnBoarding';
import { OnBoardingRepository } from './onboarding/Repositoty';

const Greeter = (name: string) => `Hello ${name}`;

export {
    Greeter, 
    ErrorBuilder, 
    ResponseHelper, 
    LoginType, 
    onboardingRules,
    CBUtility,
    OnBoardingModel,
    SocialLoginInteface,
    OnBoardingResponse,
    OnBoardingHelper,
    OnBoardingRepository
}
import { ErrorBuilder } from './helpers/ErrorBuilder';
import { CBUtility, LoginType } from './helpers/Utility';
import { ResponseHelper } from './helpers/ResponseHelper';
import { onboardingRules } from './rules/OnboardingRules';
import { OnBoardingModel } from './model/OnBoardingModel';
import { SocialLoginInteface, OnBoardingResponse } from './interface/OnboardingInterface';
import { OnBoardingHelper } from './helpers/OnBoardingHelper';
import { OnBoardingRepository } from './repositories/OnboardingRepositoty';

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
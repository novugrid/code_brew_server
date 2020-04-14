import { ErrorBuilder } from './helpers/ErrorBuilder';
import { CBUtility, LoginType } from './helpers/Utility';
import { ResponseHelper } from './helpers/ResponseHelper';
import { onboardingRules } from './onboarding/Rules';
import { OnBoardingModel } from './onboarding/Model';
import { SocialLoginRequestParams, OnBoardingResponse, RegisterRequestParams,
    LoginRequestParams, ResetPasswordRequestParams, ChangePasswordRequestParams } from './onboarding/Interface';
import { CBOnBoarding } from './onboarding/OnBoarding';
import { Emailer } from './helpers/Emailer';

const Greeter = (name: string) => `Hello ${name}`;

export {
    Greeter, 
    ErrorBuilder, 
    ResponseHelper, 
    LoginType, 
    onboardingRules,
    CBUtility,
    OnBoardingModel,
    SocialLoginRequestParams,
    OnBoardingResponse,
    CBOnBoarding,
    LoginRequestParams,
    Emailer,
    ResetPasswordRequestParams,
    ChangePasswordRequestParams,
    RegisterRequestParams,
}
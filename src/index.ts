import { ErrorBuilder } from './helpers/ErrorBuilder';
import { CBUtility, LoginType } from './helpers/Utility';
import { ResponseHelper } from './helpers/ResponseHelper';
import { onboardingRules } from './rules/OnboardingRules';

const Greeter = (name: string) => `Hello ${name}`;

export {
    Greeter, 
    ErrorBuilder, 
    ResponseHelper, 
    LoginType, 
    onboardingRules,
    CBUtility,
}
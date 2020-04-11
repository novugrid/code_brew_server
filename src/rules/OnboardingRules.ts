import {check} from "express-validator";
import { LoginType } from '../helpers/Utility';

export const onboardingRules = {
    forSocialLogin: [
        check("email").isEmail().withMessage("user's email must be a valid email"),
        check("user_name").not().isEmpty().withMessage("The user's name must not be empty"),
        check("login_type")
            .notEmpty().withMessage("please specify a login type").bail().isIn([
                LoginType.EMAIL_N_PASSWORD,
                LoginType.FACEBOOK,
                LoginType.GITHUB,
                LoginType.GOOGLE,
                LoginType.LINKEDLN,
                LoginType.TWITTER
            ]).withMessage("login type must be a valid and acceptable login type")
    ],

    forLogin: [
        check("password")
            .not().isEmpty().withMessage("Password cannot be empty"),
        check("accountId")
            .not().isEmpty().withMessage("The user account is not specified"),
    ],

    forChangePassword: [
        check("user_id").not().isEmpty().withMessage("User id must be provided"),
        check("email").not().isEmpty().withMessage("User email must be provided"),
        check("old_password").not().isEmpty().withMessage("Current user password not provided"),
        check("new_password").not().isEmpty().withMessage("New user password not provided"),
    ],

    forChangePin: [
        check("user_id").not().isEmpty().withMessage("User id must be provided"),
        check("email").not().isEmpty().withMessage("User email must be provided"),
        check("password").not().isEmpty().withMessage("User password must be provided"),
        check("old_pin").not().isEmpty().withMessage("User current pin must be provided"),
        check("new_pin").not().isEmpty().withMessage("User new pin must be provided"),
    ],

    forResetPassword: [
        check("email").not().isEmpty().withMessage("User email must be provided"),
    ],

    forResetPin: [
        check("email").not().isEmpty().withMessage("User email must be provided"),
        check("password").not().isEmpty().withMessage("User password must be provided"),
    ],
}
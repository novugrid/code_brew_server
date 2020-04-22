import {check} from "express-validator";

export const CBRules = {

    forCreateMessage: [
        check("message").notEmpty().withMessage("message must not be empty"),
        check("message_type").notEmpty().withMessage("message must not be empty"),
        check("message_title").notEmpty().withMessage("message must not be empty"),
    ]
}
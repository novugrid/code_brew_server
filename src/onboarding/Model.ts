import {Model} from "sequelize-typescript"

export class OnBoardingModel {
    id?: number
    email?: string
    address?: string
    login_type?: string
    password?: string
    user_name?: string
    mobile?: string
}
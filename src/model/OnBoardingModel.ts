import {Model} from "sequelize-typescript"

export class OnBoardingModel<T extends Model> {

    model: T
    private token!: string;

    constructor(model: T) {
        this.model = model
    }

    public setToken = (token: string) => this.token = token

    public toJson() {
        return {
            "token": this.token,
            "data": this.model
        }
    }
}
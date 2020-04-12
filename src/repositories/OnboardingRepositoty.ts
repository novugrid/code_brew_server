import { OnBoardingModel } from '../model/OnBoardingModel';

export abstract class OnBoardingRepository<T extends OnBoardingModel> {

    abstract async userExist(email: string): Promise<T>

    abstract async createUser(model: OnBoardingModel): Promise<T>

    abstract async findById(id: number): Promise<T>
}
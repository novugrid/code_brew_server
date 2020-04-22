import { ResponseHelper } from '../helpers/ResponseHelper';
import express from 'express';
import { MessageRequestParams, MessageType, CBMessage } from './CBMessage';
import { CBImage } from '../image/CBImage';
import { Sequelize, Model } from 'sequelize-typescript';
import { NonAbstractTypeOfModel } from '../onboarding/OnBoarding';

const responseHelper = new ResponseHelper() 

export class CBMessaageController<T extends Model<T>> {

    model: NonAbstractTypeOfModel<T>
    imageModel: NonAbstractTypeOfModel<T>

    constructor(model: NonAbstractTypeOfModel<T>, imageModel: NonAbstractTypeOfModel<T>) {
        this.model = model
        this.imageModel = imageModel
    }

    public async getMessages(req: express.Request, res: express.Response) {

    }

    public async createMessage(req: express.Request, res: express.Response) {
        try{
            const payload = req.body as MessageRequestParams
            const message = await this.model.create(payload)
            if(payload.message_type == MessageType.Single && payload.push_token) {
                //todo send notification device
            } else if(payload.topic_id) {
                // send the notification to topic
            }
            return responseHelper.success(res, {"message": message}, 
                "message sent succesfully");
        } catch(error) {
            console.error("error while adding a new message: ", error)
        }
    }

    public async getUserMessages(req: express.Request, res: express.Response) {
        try {
            let messages = await this.model.findAll({
                where: Sequelize.or(
                    {owner_id: req.params.id},
                    {message_type: MessageType.All}
                )
            });
            return responseHelper.success(res, {"messages": messages});
        } catch(error) {
            console.error("error while fetching user's messages: ", error)
        }
    }

}
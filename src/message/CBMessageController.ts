import { ResponseHelper } from '../helpers/ResponseHelper';
import express from 'express';
import { MessageRequestParams, MessageType, CBMessage } from './CBMessage';
import { CBImage } from '../image/CBImage';
import { Sequelize, Model } from 'sequelize-typescript';
import { NonAbstractTypeOfModel } from '../onboarding/OnBoarding';
import { Includeable } from 'sequelize/types';
import { NotificationDirector } from './NotificationDirector';
import { CBRepository } from '../CBRepository';

const responseHelper = new ResponseHelper() 
const imageQuery = {
    model: CBImage, 
    required: false, 
    separate: true
};

export class CBMessaageController{

    public async getMessages(req: express.Request, res: express.Response) {
        try {
            const messages = await CBMessage.findAll({
                include: [imageQuery]
            })
            return responseHelper.success(res, {messages: messages});
        } catch (err) {
            console.error("error fetching all the messages in the system ", err)
        }
    }

    public async createMessage(req: express.Request, res: express.Response) {
        try{
            const payload = req.body as MessageRequestParams
            let message = await CBMessage.create(payload)
            if(payload.message_type == MessageType.Single && payload.push_token) {
                new NotificationDirector()
                    .setData({"message": payload.message})
                    .setToken(payload.push_token)
                    .setNotification(payload.message_title, payload.message)
                    .send()
            } else if(payload.topic_id) {
                new NotificationDirector()
                    .setTopic(payload.topic_id)
                    .setData({"message": payload.message})
                    .setNotification(payload.message_title, payload.message)
                    .sendToTopic()
            }
            if(payload.images.length > 0){
                for (const url of payload.images) {
                    await CBImage.create({
                        url: url,
                        message_id: message.id,
                    })
                }
            }
            message = await message.reload({
                include: [imageQuery]
            })
            return responseHelper.success(res, {"message": message}, 
                "message sent succesfully");
        } catch(error) {
            console.error("error while adding a new message: ", error)
        }
    }

    public async getUserMessages(req: express.Request, res: express.Response) {
        try {
            let messages = await CBMessage.findAll({
                where: Sequelize.or(
                    {userr_id: req.params.id},
                    {message_type: MessageType.All}
                ),
                include: [imageQuery]
            });
            return responseHelper.success(res, {"messages": messages});
        } catch(error) {
            console.error("error while fetching user's messages: ", error)
        }
    }
}
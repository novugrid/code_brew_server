import {ResponseHelper} from "../helpers/ResponseHelper";
import express from 'express';
import { CBMessage, MessageRequestParams, MessageType } from './CBMessage';
import { CBImage } from '../image/CBImage';
import { Sequelize } from 'sequelize-typescript';
import { NotificationDirector } from './NotificationDirector';
import { ErrorBuilder } from '../helpers/ErrorBuilder';
import { Op} from "sequelize" // /types/lib/operators";

const responseHelper = new ResponseHelper();
const imageQuery = {
    model: CBImage,
    required: false,
    separate: true
};

export class CBMessaageController {

    public async getMessage(id: number): Promise<CBMessage | null> {
        return CBMessage.findByPk(id, {include: [imageQuery], order: [["created_at", "DESC"]]});
    }

    public async getMessages(date?: Date): Promise<CBMessage[]> {
        // That bridge
        try {
            let where = {};
            if (date != null) {
                where = {...where, "created_at": {[Op.gt]: date}}
            }

            const messages = await CBMessage.findAll({
                where: where,
                include: [imageQuery],
                order: [["created_at", "DESC"]]
            });
            return messages;
            // return responseHelper.success(res, {messages: messages});
        } catch (err) {
            console.error("error fetching all the messages in the system ", err)
            return Promise.reject(err);
        }
    }

    public async createMessage(req: express.Request, res: express.Response) {
        try {
            const payload = req.body as MessageRequestParams;
            let message = await CBMessage.create(payload);
            if (payload.images.length > 0) {
                for (const url of payload.images) {
                    await CBImage.create({
                        url: url,
                        message_id: message.id,
                    })
                }
            }
            message = await message.reload({
                include: [imageQuery]
            });
            CBMessaageController.sendNotification(payload);
            return responseHelper.success(res, {"message": message},
                "message sent succesfully");
        } catch (error) {
            console.error("error while adding a new message: ", error)
        }
    }

    public async updateMessage(req: express.Request, res: express.Response) {
        try {
            var message = await CBMessage.findByPk(req.params.id);
            if (!message) {
                return responseHelper.error(res, new ErrorBuilder("record does not exist in the system"))
            }
            const payload = req.body as MessageRequestParams;
            await message.update(payload);
            await CBImage.destroy({
                where: {
                    message_id: message.id
                }
            });
            if (payload.images.length > 0) {
                for (const url of payload.images) {
                    await CBImage.create({
                        url: url,
                        message_id: message.id,
                    })
                }
            }
            message = await message.reload({
                include: [imageQuery]
            });
            CBMessaageController.sendNotification(payload);
            return responseHelper.success(res, {"message": message},
                "message updated succesfully");
        } catch (error) {
            console.error("error while updating message: ", error)
        }
    }

    public async deleteMessage(req: express.Request, res: express.Response) {
        try {
            var message = await CBMessage.findByPk(req.params.id);
            if (!message) {
                return responseHelper.error(res, new ErrorBuilder("record does not exist in the system"))
            }
            await message.destroy();
            await CBImage.destroy({
                where: {
                    message_id: message.id
                }
            });
            return responseHelper.success(res, {},
                "message deleted succesfully");
        } catch (error) {
            console.error("error while deleting message: ", error)
        }
    }

    static async sendNotification(payload: MessageRequestParams) {
        try {
            if (payload.message_type == MessageType.Single && payload.push_token) {
                new NotificationDirector()
                    .setData({"message": payload.message})
                    .setToken(payload.push_token)
                    .setNotification(payload.message_title, payload.message)
                    .send()
            } else if (payload.topic_id) {
                new NotificationDirector()
                    .setTopic(payload.topic_id)
                    .setData({"message": payload.message})
                    .setNotification(payload.message_title, payload.message)
                    .sendToTopic()
            }
        } catch (error) {
            console.error("Error sending notification ", error)
        }
    }

    public async getUserMessages(req: express.Request, res: express.Response) {
        try {
            let messages = await CBMessage.findAll({
                where: Sequelize.or(
                    {user_id: req.params.id},
                    {message_type: MessageType.All}
                ),
                include: [imageQuery],
                order: [["created_at", "DESC"]]
            });
            return responseHelper.success(res, {"messages": messages});
        } catch (error) {
            console.error("error while fetching user's messages: ", error)
        }
    }
}

import * as firebaseAdmin from "firebase-admin";

export class NotificationDirector {

    public static TEST_TOPIC: string = "test";

    public tokenId!: string;
    public topic!: string;
    public title!: string;
    public body!: string;
    private data!: { [key: string]: string };

    public setNotification(title: string, body: string): NotificationDirector {
        this.title = title;
        this.body = body;
        return this;
    }

    public setData(data: { [key: string]: string }): NotificationDirector {
        this.data = data;
        return this;
    }

    public setToken(tokenId: string): NotificationDirector {
        this.tokenId = tokenId;
        return this;
    }

    public setTopic(topicName: string): NotificationDirector {
        this.topic = topicName;
        return this;
    }

    public send(): Promise<string> {
        const messageParams = {
            notification: {
                title: this.title,
                body: this.body,
            },
            data: this.data || {},
            token: this.tokenId,
        };
        return firebaseAdmin.messaging().send(messageParams);
    }

    public async sendToTopic() {
        const messageParams = {
            notification: {
                title: this.title,
                body: this.body,
            },
            data: this.data || {},
        };
        await firebaseAdmin.messaging().sendToTopic(this.topic, messageParams);
    }

    // Todo: Make sure we can specify different templates of notifications
}

export enum NotificationType {
    device_only = "device",
    topic_only = "topic",
    device_topic = "device_topic",
}

import { CreateNotificationController } from "../adapters/controllers/index.js";
import dependencies from "../frameworks/dependencies.js";
import { TYPE_NOTIFICATION_CREATED } from "./config.js";

export class ConsumeManager{
    constructor(){
        this.createNotificationConsumer = new CreateNotificationController(dependencies)
    }

    async manageConsumer(type,value){
        try {
            const data = JSON.parse(value)
            switch (type) {
                case TYPE_NOTIFICATION_CREATED:
                    return await this.createNotificationConsumer.createNotification(data)
                default:
                    const error = new Error();
                    error.statusCode = 500;
                    error.reasons = ['Invalid type of message!']
                    throw error
            }
        } catch (err) {
            console.log("MANAGER",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
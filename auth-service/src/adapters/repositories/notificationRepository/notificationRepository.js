import { NotificationModal } from "../../database/index.js";

class NotificationRepository{
    async createNotification(){
        throw new Error('createNotification not implemented!!')
    }
    async getNotificationsByRecieverWithPage(){
        throw new Error('getNotificationsByRecieverWithPage not implemented!!')
    }
    async getUnreadNotificationsByReciever(){
        throw new Error('getUnreadNotificationsByReciever not implemented!!')
    }
    async updateNotificationById(){
        throw new Error('updateNotificationById not implemented!!')
    }
}

export class MongoNotificationRepository extends NotificationRepository{
    async createNotification(data){
        try {
            return await NotificationModal.create(data)
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getNotificationsByRecieverWithPage(reciever_id,skip,limit){
        try {
            return await NotificationModal.find({reciever_id}).sort({createdAt:-1}).skip(skip).limit(limit)
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getUnreadNotificationsByReciever(reciever_id){
        try {
            return await NotificationModal.find({reciever_id,read_status:'UNREAD'})
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async updateNotificationById(id,data){
        try {
            return await NotificationModal.findByIdAndUpdate({_id:id},{$set:data},{new:true})
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}
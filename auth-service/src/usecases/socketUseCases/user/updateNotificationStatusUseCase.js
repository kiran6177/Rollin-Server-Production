export class UpdateNotifications{
    constructor(dependencies){
        this.notificationRepository = new dependencies.Repositories.MongoNotificationRepository()
    }

    async execute(id){
        try {
            return await this.notificationRepository.updateNotificationById(id,{read_status:'READ'})
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
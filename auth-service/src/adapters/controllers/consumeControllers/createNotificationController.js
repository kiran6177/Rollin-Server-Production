export class CreateNotification{
    constructor(dependencies){
        this.notificationCreateUseCase = new dependencies.ConsumeUseCase.NotificationCreate(dependencies)
    }
    async createNotification(data){
        try {
            return await this.notificationCreateUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
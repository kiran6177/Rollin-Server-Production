export class UserUpdatedConsume{
    constructor(dependencies){
        this.updateUserConsumeUseCase = new dependencies.ConsumeUseCase.UpdateUserUseCase(dependencies)
    }

    async updateUser(data){
        try {
            return await this.updateUserConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
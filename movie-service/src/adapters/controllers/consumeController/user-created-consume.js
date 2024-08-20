export class UserCreatedConsume{
    constructor(dependencies){
        this.addUserConsumeUseCase = new dependencies.ConsumeUseCase.AddUserUseCase(dependencies)
    }

    async createUser(data){
        try {
            return await this.addUserConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
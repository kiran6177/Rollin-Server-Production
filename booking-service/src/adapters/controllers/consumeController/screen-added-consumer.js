export class ScreenAddedConsume{
    constructor(dependencies){
        this.addScreenConsumeUseCase = new dependencies.ConsumeUseCase.AddScreenUseCase(dependencies)
    }

    async addScreen(data){
        try {
            return await this.addScreenConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
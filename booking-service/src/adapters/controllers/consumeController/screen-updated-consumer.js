export class ScreenUpdatedConsume{
    constructor(dependencies){
        this.updateScreenConsumeUseCase = new dependencies.ConsumeUseCase.UpdateScreenUseCase(dependencies)
    }

    async updateScreen(data){
        try {
            return await this.updateScreenConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
export class TheatreUpdatedConsume{
    constructor(dependencies){
        this.updateTheatreConsumeUseCase = new dependencies.ConsumeUseCase.UpdateTheatreUseCase(dependencies)
    }

    async updateTheatre(data){
        try {
            return await this.updateTheatreConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
export class TheatreCreatedConsume{
    constructor(dependencies){
        this.addTheatreConsumeUseCase = new dependencies.ConsumeUseCase.AddTheatreUseCase(dependencies)
    }

    async createTheatre(data){
        try {
            return await this.addTheatreConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
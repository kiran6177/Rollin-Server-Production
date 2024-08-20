export class MovieStatusUpdatedConsume{
    constructor(dependencies){
        this.updateMovieStatusConsumeUseCase = new dependencies.ConsumeUseCase.UpdateMovieStatusUseCase(dependencies)
    }

    async updateMovieStatus(data){
        try {
            return await this.updateMovieStatusConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
export class ShowMovieAddedConsume{
    constructor(dependencies){
        this.addedShowMovieConsumeUseCase = new dependencies.ConsumeUseCase.ShowAddedUseCase(dependencies)
    }

    async addedShowMovie(data){
        try {
            return await this.addedShowMovieConsumeUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
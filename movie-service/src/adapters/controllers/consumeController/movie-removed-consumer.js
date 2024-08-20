export class MovieRemovedConsume{
    constructor(dependencies){
        this.removeMovieFromTheatreUseCase = new dependencies.ConsumeUseCase.RemoveMovieFromTheatre(dependencies)
    }

    async removeMovieFromTheatre(data){
        try {
            return await this.removeMovieFromTheatreUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
export class MovieEnrolledConsume{
    constructor(dependencies){
        this.addMovieToTheatreUseCase = new dependencies.ConsumeUseCase.AddMovieToTheatre(dependencies)
    }

    async addMovieToTheatre(data){
        try {
            return await this.addMovieToTheatreUseCase.execute(data)
        } catch (err) {
            console.log("CON",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
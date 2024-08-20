export class UserQueryMovie{
    constructor(dependencies){
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
    }

    async execute({search}){
        try {
            console.log(search);
            const movies = await this.movieRepository.getMovieByQuery(search)
            return movies
        }catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
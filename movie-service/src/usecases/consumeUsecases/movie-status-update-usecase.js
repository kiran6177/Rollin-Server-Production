export class UpdateMovieStatusUseCase{
    constructor(dependencies){
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
    }

    async execute(data){
        try {
            console.log("MOVIEUSE",data);
            const {screen_id,movie_id,status} = data;
            const updateMovie = await this.movieRepository.updateMovieStatus(movie_id,status);
            if(updateMovie){
                console.log("Updated Movie");
            }else{
                console.log("Unable to update Movie");
            }
            return
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
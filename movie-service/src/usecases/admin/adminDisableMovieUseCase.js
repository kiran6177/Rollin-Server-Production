export class AdminMovieDisable{
    constructor(dependencies){
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.personRepository = new dependencies.Repositories.MongoPersonRepository()
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
    }

    async execute({movie_id}){
        try {
            if(movie_id){
                const movieExist = await this.movieRepository.findMovieById(movie_id)
                if(movieExist){
                    const enrolledMovies = await this.theatreRepository.findEnrolledMoviesByMovieId(movie_id)
                    if(enrolledMovies?.length > 0){
                        enrolledMovies.map(movie=>{
                            console.log(movie._id.toString() , movie_id);
                            if(movie._id.toString() === movie_id){
                                const error = new Error()
                                error.statusCode = 400;
                                error.reasons = ['Movie is running in some theatres.']
                                throw error
                            }
                        })
                    }
                    const disabledMovie = await this.movieRepository.manageMovieById(movie_id,true)
                    return true
                }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['Invalid Movie!!']
                    throw error
                }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid Inputs!!']
                throw error
            }
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
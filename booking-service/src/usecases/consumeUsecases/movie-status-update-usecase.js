export class UpdateMovieStatusUseCase{
    constructor(dependencies){
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
    }

    async execute(data){
        try {
            console.log("MOVIEUSE",data);
            const {screen_id,movie_id,status} = data;
            const updateMovie = await this.screenRepository.updateMovieStatusByMovieId(screen_id,movie_id,status)
            if(updateMovie){
                console.log("Movie updated");
            }else{
                console.log("UNABLE TO Update movie");
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
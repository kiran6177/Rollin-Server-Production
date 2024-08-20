export class RemoveMovieFromTheatre{
    constructor(dependencies){
        this.theatreReposiory = new dependencies.Repositories.MongoTheatreRepository()
    }

    async execute(data){
        try {
            console.log(data);
            if(data?.theatre_id && data?.movie_id){
                const addMovies = await this.theatreReposiory.removeMovieFromTheatre(data.theatre_id,data.movie_id);
                if(addMovies){
                    console.log("MOVIE REMOVED ");
                }else{
                    console.log("UNABLE TO REMOVE MOVIE");
                }
            }else{
                console.log("ERROR NO DATA");
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
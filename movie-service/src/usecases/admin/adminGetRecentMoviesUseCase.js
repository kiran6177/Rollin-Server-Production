import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';

export class AdminRecentMoviesGet{
    constructor(dependencies){
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute(){
        try {
            console.log("RECENT");
            const recentMovies = await this.movieRepository.getRecentMoviesByLimit(5)
            console.log(recentMovies);
            let resultData = []
            for(let movie of recentMovies){
                const poster_path = await this.awsConfig.getImage(movie?.poster_path,MOVIE_OWNER)
                resultData.push({
                    ...movie,
                    poster_path
                })
            }
            return resultData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
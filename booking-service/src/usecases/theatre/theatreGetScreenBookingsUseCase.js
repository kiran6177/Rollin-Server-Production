import { AwsConfig } from "../../utils/aws-s3.js";

const MOVIE_OWNER = 'movie';

export class TheatreScreenBookingsGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({page,screen_id},{id}){
        try {
            console.log("THEATRE",screen_id,id,page);
            let pageOf = page ? page : 1 
            const limit = 20;
            const skip = (parseInt(pageOf) - 1) * limit;
            const date = new Date()
            date.setUTCHours(0,0,0,0)
            console.log("SKIP",skip,date,limit);
            const showsByScreen = await this.reservationRepository.getShowsByTheatreIdAndScreenId(id,screen_id,date,limit,skip);
            console.log("LIST",showsByScreen);
            
            const updatedShows = []
            for(let show of showsByScreen){
                let movie_data;
                for(let movie of show.screenData[0].running_movies){
                    if(movie.movie_id.toString() === show.movie_id.toString()){
                        const backdrop_path = await this.awsConfig.getImage(movie?.backdrop_path,MOVIE_OWNER)
                        const poster_path = await this.awsConfig.getImage(movie?.poster_path,MOVIE_OWNER)
                        movie_data = {...movie,backdrop_path,poster_path}
                    }
                }
                updatedShows.push({
                    ...show,
                    movie_data
                })
            }
            console.log(showsByScreen.length);
            return updatedShows
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
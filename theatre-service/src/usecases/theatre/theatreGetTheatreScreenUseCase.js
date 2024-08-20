import { UNKNOWN_IMAGE } from "../../config/api.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class TheatreScreenDataGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({id}){
        try {
            console.log(id);
            const data = await this.theatreRepository.getScreenDataById(id)
            let dataModified = [];
            if(data.length > 0){
            console.log("SCREEN THEATRE",data);
                for(let screen of data){
                    let running_movies = [];
                    if(screen?.running_movies?.length > 0){
                        for(let movie of screen.running_movies){
                            const backdrop_path = await this.awsConfig.getImage(movie.backdrop_path,MOVIE_OWNER)
                            const poster_path = await this.awsConfig.getImage(movie.poster_path,MOVIE_OWNER)
                            const cast = []
                            for(let castObj of movie.cast){
                                if(castObj.profile_path){
                                    let profile_path = await this.awsConfig.getImage(castObj.profile_path,PEOPLE_OWNER)
                                    cast.push({
                                        ...castObj,
                                        profile_path
                                    })
                                }else{
                                    cast.push({
                                        ...castObj,
                                        profile_path:UNKNOWN_IMAGE
                                    })
                                }
                                
                            }
                            const crew = []
                            for(let crewObj of movie.crew){
                                if(crewObj.profile_path){
                                    let profile_path = await this.awsConfig.getImage(crewObj.profile_path,PEOPLE_OWNER)
                                    crew.push({
                                        ...crewObj,
                                        profile_path,
                                    })
                                }else{
                                    crew.push({
                                        ...crewObj,
                                        profile_path:UNKNOWN_IMAGE
                                    })
                                }
                            }

                            running_movies.push({
                                ...movie,
                                backdrop_path,
                                poster_path,
                                cast,
                                crew
                            })
                        }
                    }
                    dataModified.push({
                        ...screen,
                        running_movies
                    })
                }
            }else{
                dataModified = data
            }
            return dataModified
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
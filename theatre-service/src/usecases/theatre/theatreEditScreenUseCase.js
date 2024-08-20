import { UNKNOWN_IMAGE } from "../../config/api.js";
import { BOOKING_TOPIC, TYPE_SCREEN_UPDATED } from "../../events/config.js";
import { KafkaService } from "../../events/kafkaclient.js";
import { AwsConfig } from "../../utils/aws-s3.js"
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class TheatreScreenEdit{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.awsConfig = new AwsConfig()
        this.kafkaClient = new KafkaService()
    }

    async execute({screen_id,name,tierData,showData,speakers}){
        try {
            if(screen_id){
                const screenValid = await this.screenRepository.findScreenById(screen_id)
                if(screenValid){
                    if(tierData?.length > 0 && showData?.length > 0 && speakers !== null){
                        const tiers = tierData.map((tierObj,i)=>{
                            return {
                                name:tierObj.name.trim(),
                                seats:tierObj.seats,
                                rate:tierObj.rate,
                                order:i+1,
                                horizontal_partition:tierObj?.horizontal_partition ? parseInt(tierObj?.horizontal_partition) : 0,
                                columns:tierObj?.columns ? parseInt(tierObj?.columns) : 0,
                                layout: tierObj?.layout ? tierObj.layout : []
                            }
                        })
                        const showtimes = showData.map(showObj=>{
                            return {
                                showtime:showObj.showtime,
                                movie_id:showObj.movie_id
                            }
                        })
                        const dataToAdd = {
                            name,
                            tiers,
                            showtimes,
                            sound_setup:speakers
                        }
                        console.log(dataToAdd);
                        const editedUpdate = await this.screenRepository.findScreenAndUpdate(screen_id,dataToAdd)
                        this.kafkaClient.produceMessage(BOOKING_TOPIC,{
                            type:TYPE_SCREEN_UPDATED,
                            value:JSON.stringify(editedUpdate)
                        })
                        console.log(editedUpdate);
                        let dataWithImages = editedUpdate
                        if(editedUpdate?.running_movies?.length > 0){
                            let running_movies = []
                            for(let movie of editedUpdate.running_movies){
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
                            dataWithImages = {
                                ...editedUpdate,
                                running_movies
                            }
                        }
                        return dataWithImages
                    }else{
                        const error = new Error()
                        error.statusCode = 400;
                        error.reasons = ['Invalid input data!!'];
                        throw error;
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['Invalid screen data!!'];
                    throw error;
                }                
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid screen data!!'];
                throw error;
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
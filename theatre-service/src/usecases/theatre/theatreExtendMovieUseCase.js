import { UNKNOWN_IMAGE } from "../../config/api.js";
import { BOOKING_TOPIC, TYPE_SCREEN_UPDATED } from "../../events/config.js";
import { KafkaService } from "../../events/kafkaclient.js";
import { AwsConfig } from "../../utils/aws-s3.js";
import { scheduleEnrollmentEndNotification } from "../../utils/scheduler.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class TheatreMovieExtend{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.awsConfig = new AwsConfig()
        this.kafkaClient = new KafkaService()
    }

    async execute({screen_id,movie_id,enroll_toDate}){
        try {
            if(screen_id){
                const screenValid = await this.screenRepository.findScreenById(screen_id)
                if(screenValid){
                    console.log(screen_id,movie_id,enroll_toDate);
                    const extendedResult = await this.screenRepository.extendMovie(screen_id,movie_id,enroll_toDate)
                    console.log("EXT",extendedResult);
                    this.kafkaClient.produceMessage(BOOKING_TOPIC,{
                        type:TYPE_SCREEN_UPDATED,
                        value:JSON.stringify(extendedResult)
                    })
                    let dataWithImages = {}
                        if(extendedResult?.running_movies?.length > 0){
                            let running_movies = []
                            for(let movie of extendedResult.running_movies){
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
                                ...extendedResult,
                                running_movies
                            }
                        }
                        console.log("SCHEDULE====>");
                        //NOTIFY_DATE_SET_TO_10_AM_ON_1_DAY_BEFORE_ENROLL_TO
                        const theatreData = await this.theatreRepository.getTheatreByScreenId(screen_id)
                        const moviedata = await this.screenRepository.findMovieEnrolled(screen_id,movie_id)
                        const screendata = { 
                            screen_id,
                            screen_name:screenValid?.name,
                            movie_id
                        }
                        const notifyDate = new Date(enroll_toDate)
                        notifyDate.setDate(notifyDate.getDate() - 1);
                        notifyDate.setHours(10,0,0,0)
                        console.log(notifyDate,theatreData[0]?._id,moviedata[0]?.running_movies,screendata);
                        scheduleEnrollmentEndNotification(notifyDate,theatreData[0]?._id,moviedata[0]?.running_movies,screendata)
                        return dataWithImages;
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
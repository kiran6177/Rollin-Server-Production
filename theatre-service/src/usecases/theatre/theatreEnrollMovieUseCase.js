import { UNKNOWN_IMAGE } from "../../config/api.js";
import { GENRES } from "../../config/constants/movie-constants/genres.js";
import { BOOKING_TOPIC, MOVIE_TOPIC, TYPE_MOVIE_ENROLLED, TYPE_SCREEN_UPDATED } from "../../events/config.js";
import { AwsConfig } from "../../utils/aws-s3.js";
import { KafkaService } from '../../events/kafkaclient.js'
import { scheduleEnrollmentEndNotification } from "../../utils/scheduler.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'


export class TheatreMovieEnroll{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.awsConfig = new AwsConfig()
        this.kafkaClient = new KafkaService()
    }

    async execute({screen_id,movie,enroll_from,enroll_to}){
        try {
            console.log(screen_id);
            if(screen_id ){
                const isValid = await this.screenRepository.findScreenById(screen_id)
                if(isValid){
                    if(movie){
                        if((enroll_from && enroll_to)&& (enroll_to > enroll_from)){
                            console.log("VALID");

                            const runningNow = await this.screenRepository.findMovieEnrolled(screen_id,movie._id)
                            console.log(runningNow);
                            if(runningNow?.length === 0){
                                const genres = [];
                                GENRES.map(genreObj=>{
                                    movie.genres.map(genre=>{
                                        if(genre === genreObj.name){
                                            genres.push(genreObj)
                                        }
                                    })
                                })
                                const cast = []
                                for(let castObj of movie.cast){
                                    cast.push({
                                        ...castObj,
                                        profile_path:castObj.profile_path.split('?')[0].split('/').reverse()[0] != 'images' ? castObj.profile_path.split('?')[0].split('/').reverse()[0] : null
                                    })
                                }
                                const crew = []
                                for(let crewObj of movie.crew){
                                    crew.push({
                                        ...crewObj,
                                        profile_path:crewObj.profile_path.split('?')[0].split('/').reverse()[0] != 'images' ? crewObj.profile_path.split('?')[0].split('/').reverse()[0] : null
                                    })
                                }
    
                                const data = {
                                    movie_id:movie?._id,
                                    title:movie?.title,
                                    language:movie?.language,
                                    overview:movie?.overview,
                                    release_date:new Date(movie?.release_date),
                                    popularity:movie?.popularity,
                                    rating:movie?.rating,
                                    genres,
                                    crew,
                                    cast,
                                    isAssigned:movie?.isAssigned,
                                    video_link:movie?.video_link,
                                    runtime:movie?.runtime,
                                    backdrop_path:movie?.backdrop_path.split('?')[0].split('/').reverse()[0],
                                    poster_path:movie?.poster_path.split('?')[0].split('/').reverse()[0],
                                    enroll_from,
                                    enroll_to
                                }
                                console.log(data);
                                const enrolledMovieResult = await this.screenRepository.enrollMovie(screen_id,data);
                                console.log(enrolledMovieResult);
                                this.kafkaClient.produceMessage(BOOKING_TOPIC,{
                                    type:TYPE_SCREEN_UPDATED,
                                    value:JSON.stringify(enrolledMovieResult)
                                })
                                let dataWithImages = {}
                                if(enrolledMovieResult?.running_movies?.length > 0){
                                    let running_movies = []
                                    for(let movie of enrolledMovieResult.running_movies){
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
                                        ...enrolledMovieResult,
                                        running_movies
                                    }
                                }
                                const theatreData = await this.theatreRepository.getTheatreByScreenId(screen_id)
                                console.log(theatreData);
                                if(theatreData?.length > 0 && theatreData[0]?._id){
                                    const dataToPub = {
                                        movie_id:movie._id,
                                        theatre_id:theatreData[0]?._id
                                    }

                                    this.kafkaClient.produceMessage(MOVIE_TOPIC,{
                                        type:TYPE_MOVIE_ENROLLED,
                                        value:JSON.stringify(dataToPub)
                                    })
                                }
                                console.log("SCHEDULE====================>");
                                //NOTIFY_DATE_SET_TO_10_AM_ON_1_DAY_BEFORE_ENROLL_TO
                                console.log(enroll_to);
                                const notifyDate = new Date(enroll_to)
                                notifyDate.setDate(notifyDate.getDate() - 1);
                                notifyDate.setHours(10,0,0,0)
                                const screendata = { 
                                    screen_id,
                                    screen_name:isValid?.name,
                                    movie_id:data?.movie_id
                                }
                                console.log(notifyDate,theatreData[0]?._id,data,screendata);
                                scheduleEnrollmentEndNotification(notifyDate,theatreData[0]?._id,data,screendata)
                                return dataWithImages;
                            }else{
                                const error = new Error()
                                error.statusCode = 400;
                                error.reasons = ['Movie already enrolled!!'];
                                throw error;
                            }
                            
                        }else{
                            const error = new Error()
                            error.statusCode = 400;
                            error.reasons = ['Invalid date range!!'];
                            throw error;
                        }
                    }else{
                        const error = new Error()
                        error.statusCode = 400;
                        error.reasons = ['Invalid movie data!!'];
                        throw error;
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['Invalid screen!!'];
                    throw error;
                }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid screen id!!'];
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
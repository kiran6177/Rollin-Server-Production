import { UNKNOWN_IMAGE } from "../../config/constants/movieApi.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class UserAllMoviesWithFilterGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({filters}){
        try {
            const pageValue = filters?.page !== null ? filters.page : 1;
            const limit = 20;
            const skipValue = (pageValue * limit) - limit;
            const resultData = await this.movieRepository.GetMoviesAndPeopleWithLimitAndFilter(filters,skipValue,limit);
            let moviesWithLocation = []
            if(filters?.location?.lat && filters?.location?.lng){
                const theatres = await this.theatreRepository.findMoviesFromTheatreByLocation([filters.location.lat,filters.location.lng],50)
                if(theatres?.length > 0){
                    let movieIdsSet = new Set()
                    for(let theatre of theatres){
                        if(theatre?.enrolledMovies?.length > 0){
                            for(let movieId of theatre.enrolledMovies){
                                movieIdsSet.add(movieId.toString())
                            }
                        }
                    }
                    let movieIds = Array.from(movieIdsSet)
                    if(movieIds?.length > 0){
                        let moviesDetails = [];
                        for(let movieId of movieIds){
                                const movieData = await this.movieRepository.findMovieByMovieIdWithPeople(movieId)
                                moviesDetails.push(movieData)
                        }

                        if((!filters?.search || filters?.search === '')){
                            resultData.forEach(movie=>{
                                moviesDetails.forEach(runningMovie=>{
                                    if(runningMovie._id.toString() === movie._id.toString()){
                                        moviesWithLocation.push(movie)
                                    }
                                })
                            })
                            console.log("LOC MOVIES",moviesWithLocation);
                        }else{
                            console.log("SEARCH");
                            resultData.forEach(movie=>{
                                let added = false;
                                for(let runningMovie of moviesDetails){
                                    if(runningMovie._id.toString() === movie._id.toString()){
                                        moviesWithLocation.push(movie)
                                        added = true;
                                        break;
                                    }
                                }
                                if(!added){
                                    moviesWithLocation.push({...movie,isDislocated:true})
                                }
                            })
                        }
                    }
                }
            }else{
                    moviesWithLocation = resultData
            }

            let returnData = [];
            for(let data of moviesWithLocation){
                const backdrop_path = await this.awsConfig.getImage(data.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(data.poster_path,MOVIE_OWNER)
                let castWithImages = []
                let crewWithImages = []
                let genres = []
                    for(let genre of data.genres){
                        genres.push(genre.name)
                    }

                    for(let castData of data.cast){
                            let profile_path;
                            if(castData?.cast_id?.profile_path){
                                let url = await this.awsConfig.getImage(castData.cast_id.profile_path,PEOPLE_OWNER)
                                if(url){
                                    profile_path = url;
                                }else{
                                    profile_path = UNKNOWN_IMAGE
                                }
                            }else{
                                profile_path = UNKNOWN_IMAGE
                            }
                            castWithImages.push({
                                ...castData.cast_id,
                                profile_path,
                                character:castData.character
                            })
                    }

                    for(let crewData of data.crew){
                        let profile_path;
                            if(crewData?.crew_id?.profile_path){
                                let url = await this.awsConfig.getImage(crewData.crew_id.profile_path,PEOPLE_OWNER)
                                if(url){
                                    profile_path = url;
                                }else{
                                    profile_path = UNKNOWN_IMAGE
                                }
                            }else{
                                profile_path = UNKNOWN_IMAGE
                            }
                            crewWithImages.push({
                                ...crewData.crew_id,
                                profile_path,
                            })
                    }
                let release_date = new Date(data.release_date)
                 returnData.push({
                    ...data,
                    backdrop_path,
                    poster_path,
                    genres,
                    release_date:release_date.getFullYear()+'-'+((release_date.getMonth()+1) < 10 ? '0'+(release_date.getMonth()+1) : release_date.getMonth()+1)+'-'+release_date.getDate(),
                    cast:castWithImages,
                    crew:crewWithImages
                })
            }
            console.log("NORMAL",returnData);
            return returnData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
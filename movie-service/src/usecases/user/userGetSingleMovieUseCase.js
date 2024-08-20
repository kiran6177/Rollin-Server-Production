import { UNKNOWN_IMAGE } from "../../config/constants/movieApi.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class UserSingleMovieGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({location,movie_id}){
        try {
            let locationBased = []
            if(location?.lat && location?.lng){
                const theatres = await this.theatreRepository.findMoviesFromTheatreByLocation([location.lat,location.lng],50)
                if(theatres?.length > 0){
                    let movieIds = []
                    for(let theatre of theatres){
                        if(theatre?.enrolledMovies?.length > 0){
                            for(let movieId of theatre.enrolledMovies){
                                movieIds.push(movieId)
                            }
                        }
                    }
                    if(movieIds?.length > 0){
                        for(let movieId of movieIds){
                                const movieData = await this.movieRepository.findMovieByMovieIdWithPeople(movieId)
                                locationBased.push(movieData)
                        }
                    }
                }
            }
            const movieById = await this.movieRepository.findMovieByMovieIdWithPeople(movie_id)
            console.log("MOOO",movieById);
            let movieOutput ;
                const backdrop_path = await this.awsConfig.getImage(movieById.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(movieById.poster_path,MOVIE_OWNER)
                let castWithImages = []
                let crewWithImages = []
                let genres = []
                    for(let genre of movieById.genres){
                        genres.push(genre.name)
                    }

                    for(let castData of movieById.cast){
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

                    for(let crewData of movieById.crew){
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
                let release_date = new Date(movieById.release_date)
                 movieOutput = {
                    ...movieById,
                    backdrop_path,
                    poster_path,
                    genres,
                    release_date:release_date.getFullYear()+'-'+((release_date.getMonth()+1) < 10 ? '0'+(release_date.getMonth()+1) : release_date.getMonth()+1)+'-'+release_date.getDate(),
                    cast:castWithImages,
                    crew:crewWithImages
                }
                console.log("LOCCC",locationBased);
                console.log("That",movieOutput);
            if(locationBased?.length > 0){
                let isFound = false;
                for(let movieObj of locationBased){
                    if(movieOutput._id.toString() == movieObj._id.toString()){
                        isFound = true;
                        break;
                    }
                }
                if(!isFound){
                    movieOutput = {
                        ...movieOutput,
                        isDislocated:true
                    }
                }
            }else{
                movieOutput = {
                    ...movieOutput,
                    isDislocated:true
                }
            }
            console.log("moviiiii",movieOutput);
            return movieOutput
        }catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
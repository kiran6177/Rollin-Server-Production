import { UNKNOWN_IMAGE } from "../../config/constants/movieApi.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class AdminMoviesFromDBGet{
    constructor(dependencies){
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({page}){
        try {
            const pageValue = page !== null ? page : 1;
            const limit = 20;
            const skipValue = (pageValue * limit) - limit;
            const resultData = await this.movieRepository.GetMoviesAndPeopleWithLimit(skipValue,limit);

            let returnData = [];
            for(let data of resultData){
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
            console.log(returnData);
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
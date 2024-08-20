import { UNKNOWN_IMAGE } from "../../config/constants/movieApi.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class UserPersonGet{
    constructor(dependencies){
        this.personRepository = new dependencies.Repositories.MongoPersonRepository()
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({person_id}){
        try {
            const resultData = await this.personRepository.GetPersonWithId(person_id);
            console.log(resultData);
            let personData;
            if(resultData){
                const moviesOfPerson = await this.movieRepository.findMovieByPersonId(resultData._id)
                const moviesWithImage = []
                if(moviesOfPerson?.length > 0){
                    for(let movie of moviesOfPerson){
                        let poster_path ;
                        let backdrop_path;
                        if(movie.poster_path){
                            let url = await this.awsConfig.getImage(movie.poster_path,MOVIE_OWNER)
                            if(url){
                                poster_path = url
                            }
                        }
                        if(movie.backdrop_path){
                            let url = await this.awsConfig.getImage(movie.backdrop_path,MOVIE_OWNER)
                            if(url){
                                backdrop_path = url
                            }
                        }
                        moviesWithImage.push({
                            ...movie,
                            poster_path,
                            backdrop_path
                        })
                    }
                    
                    if(resultData.profile_path){
                        let profile_path ;
                        let url = await this.awsConfig.getImage(resultData.profile_path,PEOPLE_OWNER)
                        if(url){
                            profile_path = url
                        }else{
                            profile_path = UNKNOWN_IMAGE
                        }
                        personData = {
                            ...resultData,
                            profile_path,
                            moviesOfPerson:moviesWithImage
                        }
                    }else{
                        personData = {
                            ...resultData,
                            profile_path:UNKNOWN_IMAGE,
                            moviesOfPerson:moviesWithImage
                        }
                    }
                    return personData
                }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Person Not Found!!'];
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
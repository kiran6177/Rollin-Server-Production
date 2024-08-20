import { UNKNOWN_IMAGE } from "../../config/constants/movieApi.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class AdminPersonsFromDBGet{
    constructor(dependencies){
        this.personRepository = new dependencies.Repositories.MongoPersonRepository()
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({page}){
        try {
            const pageValue = page !== null ? page : 1;
            const limit = 20;
            const skipValue = (pageValue * limit) - limit;
            const resultData = await this.personRepository.GetPeopleWithLimit(skipValue,limit);
            console.log(resultData);
            const personData = [];
            for(let person of resultData){
                const moviesOfPerson = await this.movieRepository.findMovieByPersonId(person._id)

                const moviesWithImage = []

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
                
                if(person.profile_path){
                    let profile_path ;
                    let url = await this.awsConfig.getImage(person.profile_path,PEOPLE_OWNER)
                    if(url){
                        profile_path = url
                    }else{
                        profile_path = UNKNOWN_IMAGE
                    }
                    personData.push({
                        ...person,
                        profile_path,
                        moviesOfPerson:moviesWithImage
                    })
                }else{
                    personData.push({
                        ...person,
                        profile_path:UNKNOWN_IMAGE,
                        moviesOfPerson:moviesWithImage
                    })
                }
            }
            return personData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
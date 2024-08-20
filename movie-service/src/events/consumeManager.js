import { MovieEnrolledConsumeController, MovieRemovedConsumeController, MovieStatusUpdatedConsumeController, TheatreCreatedConsumeController, TheatreUpdatedConsumeController, UserCreatedConsumeController, UserUpdatedConsumeController } from "../adapters/controllers/index.js";
import dependencies from "../frameworks/dependencies.js";
import { TYPE_MOVIE_ENROLLED, TYPE_MOVIE_REMOVED, TYPE_MOVIESTATUS_CHANGED, TYPE_THEATRE_CREATED, TYPE_THEATRE_UPDATED, TYPE_USER_CREATED, TYPE_USER_UPDATED } from "./config.js";

export class ConsumeManager{
    constructor(){
        this.userCreatedConsumer = new UserCreatedConsumeController(dependencies)
        this.theatreCreatedConsumer = new TheatreCreatedConsumeController(dependencies)
        this.theatreUpdatedConsumer = new TheatreUpdatedConsumeController(dependencies)
        this.userUpdatedConsumer = new UserUpdatedConsumeController(dependencies)
        this.addEnrolledMovieConsumer = new MovieEnrolledConsumeController(dependencies)
        this.removeMovieConsumer = new MovieRemovedConsumeController(dependencies)
        this.updateMovieStatusConsumer = new MovieStatusUpdatedConsumeController(dependencies)
    }
    async manageConsumer(type,value){
        try {
            const data = JSON.parse(value)
            switch (type) {
                case TYPE_USER_CREATED:
                    return await this.userCreatedConsumer.createUser(data)
                case TYPE_USER_UPDATED:
                    return await this.userUpdatedConsumer.updateUser(data)  
                case TYPE_THEATRE_CREATED:
                    return await this.theatreCreatedConsumer.createTheatre(data) 
                case TYPE_THEATRE_UPDATED:
                    return await this.theatreUpdatedConsumer.updateTheatre(data) 
                case TYPE_MOVIE_ENROLLED:
                    return await this.addEnrolledMovieConsumer.addMovieToTheatre(data) 
                case TYPE_MOVIE_REMOVED:
                    return await this.removeMovieConsumer.removeMovieFromTheatre(data)
                case TYPE_MOVIESTATUS_CHANGED:
                    return await this.updateMovieStatusConsumer.updateMovieStatus(data)
                default:
                    const error = new Error();
                    error.statusCode = 500;
                    error.reasons = ['Invalid type of message!']
                    throw error
            }
        } catch (err) {
            console.log("MANAGE",err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }

}
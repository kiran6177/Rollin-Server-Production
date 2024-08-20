import { MovieStatusUpdatedConsumeController, ScreenAddedConsumeController, ScreenUpdatedConsumeController, ShowMovieAddedConsumeController, TheatreCreatedConsumeController, TheatreUpdatedConsumeController, UserCreatedConsumeController , UserUpdatedConsumeController} from "../adapters/controllers/index.js";
import dependencies from "../frameworks/dependencies.js";
import { TYPE_MOVIESTATUS_CHANGED, TYPE_SCREEN_ADDED, TYPE_SCREEN_UPDATED, TYPE_SHOWMOVIE_ADDED, TYPE_THEATRE_CREATED, TYPE_THEATRE_UPDATED, TYPE_USER_CREATED, TYPE_USER_UPDATED } from "./config.js";

export class ConsumeManager{
    constructor(){
        this.userCreatedConsumer = new UserCreatedConsumeController(dependencies)
        this.theatreCreatedConsumer = new TheatreCreatedConsumeController(dependencies)
        this.theatreUpdatedConsumer = new TheatreUpdatedConsumeController(dependencies)
        this.userUpdatedConsumer = new UserUpdatedConsumeController(dependencies)
        this.screenAddedConsumer = new ScreenAddedConsumeController(dependencies)
        this.screenUpdatedConsumer = new ScreenUpdatedConsumeController(dependencies)
        this.showMovieAddedConsumer = new ShowMovieAddedConsumeController(dependencies)
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
                case TYPE_SCREEN_ADDED:
                    return await this.screenAddedConsumer.addScreen(data)
                case TYPE_SCREEN_UPDATED:
                    return await this.screenUpdatedConsumer.updateScreen(data)
                case TYPE_SHOWMOVIE_ADDED:
                    return await this.showMovieAddedConsumer.addedShowMovie(data)
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
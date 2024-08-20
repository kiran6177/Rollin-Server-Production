import { Reminder } from '../../entities/reminderEntity.js'
export class UserMovieReminderSet{
    constructor(dependencies){
        this.reminderRepository = new dependencies.Repositories.MongoReminderRepository()
    }

    async execute({data},{id}){
        try {
            const {movie_id} = data;
            console.log("REMINDERSET",movie_id,id);
            if(movie_id && id){
                const movieDocExist = await this.reminderRepository.findReminderByMovieId(movie_id);
                console.log(movieDocExist);
                if(!movieDocExist){
                    const reminderObj = new Reminder({movie:movie_id,users:[id]})
                    const addReminder = await this.reminderRepository.addReminder(reminderObj)
                    console.log(addReminder);
                }else{
                    if(movieDocExist?.users.includes(id)){
                        const error = new Error()
                        error.statusCode = 400
                        error.reasons = ['Reminder Exists!!']
                        throw error;
                    }
                    const addUser = await this.reminderRepository.addUsersByMovieID(movie_id,id)
                    console.log(addUser);
                }
                return true
            }else{
                const error = new Error()
                error.statusCode = 400
                error.reasons = ['Invalid Inputs!!']
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
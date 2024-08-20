export class UpdateTheatreUseCase{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
    }

    async execute(data){
        try {
            console.log(data);
            const {_id,...rest} = data;
            const updateTheatre = await this.theatreRepository.updateTheatreById(_id,rest)
            if(updateTheatre){
                console.log("THEATRE UPDATED");
            }else{
                console.log("UNABLE TO UPDATE THEATRE");
            }
            return
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
export class AddTheatreUseCase{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
    }

    async execute(data){
        try {
            console.log(data);
            const addTheatre = await this.theatreRepository.createTheatre(data)
            if(addTheatre){
                console.log("THEATRE CREATED");
            }else{
                console.log("UNABLE TO CREATE THEATRE");
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
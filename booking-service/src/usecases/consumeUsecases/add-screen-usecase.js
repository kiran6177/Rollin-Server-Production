export class AddScreenUseCase{
    constructor(dependencies){
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
    }

    async execute(data){
        try {
            const {theatre_id,...rest} = data;
            console.log(theatre_id,rest);
            const addScreen = await this.screenRepository.addScreen(rest)
            if(addScreen){
                await this.theatreRepository.addScreenToTheatre(theatre_id,addScreen._id)
                console.log("SCREEN CREATED");
            }else{
                console.log("UNABLE TO CREATE SCREEN");
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
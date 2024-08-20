export class UpdateScreenUseCase{
    constructor(dependencies){
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
    }

    async execute(data){
        try {
            const {_id,...rest} = data;
            console.log(_id,rest);
            const updateScreen = await this.screenRepository.updateScreen(_id,rest)
            if(updateScreen){
                console.log("SCREEN UPDATED");
            }else{
                console.log("UNABLE TO UPDATE SCREEN");
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
export class AddUserUseCase{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
    }

    async execute(data){
        try {
            console.log(data);
            const addUser = await this.userRepository.createUser(data)
            if(addUser){
                console.log("USER CREATED");
            }else{
                console.log("UNABLE TO CREATE USER");
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
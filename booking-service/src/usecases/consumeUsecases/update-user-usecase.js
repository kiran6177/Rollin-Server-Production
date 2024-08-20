export class UpdateUserUseCase{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
    }

    async execute(data){
        try {
            console.log(data);
            const {_id,...rest} = data;
            const updateUser = await this.userRepository.updateUserById(_id,rest)
            if(updateUser){
                console.log("USER UPDATED");
            }else{
                console.log("UNABLE TO UPDATE USER");
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
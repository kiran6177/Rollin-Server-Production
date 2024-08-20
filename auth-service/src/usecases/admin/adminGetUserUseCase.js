export class GetUsers{
    constructor(dependencies){
        this.adminRepository = new dependencies.Repositories.MongoAdminRepository()
    }

    async execute(){
        try {
            const users = await this.adminRepository.getAllUsers();
            const usersWOP = users.map(user=>{
                return {
                    id:user._id,
                    email:user.email,
                    mobile:user.mobile,
                    firstname:user.firstname,
                    lastname:user.lastname,
                    isVerified:user.isVerified,
                }
            })
            return usersWOP
        } catch (err) {
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
import { AdminModel, TheatreModel, UserModel } from "../../database/index.js";

class AdminRepository{
    async findAdminByEmail(){
        throw new Error('findAdminByEmail not implemented!!');
    }
    async findAdminById(){
        throw new Error('findAdminById not implemented!!');
    }
    async getAllUsers(){
        throw new Error('getAllUsers not implemented!!');
    }
    async getAllTheatres(){
        throw new Error('getAllTheatres not implemented!!');
    }
}
export class MongoAdminRepository extends AdminRepository{

    async findAdminByEmail(email){
        try {
            return await AdminModel.findOne({email});
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async findAdminById(id){
        try {
            return await AdminModel.findById({_id:id});
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async getAllUsers(){
        try {
            return await UserModel.find()
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async getAllTheatres(){
        try {
            return await TheatreModel.find()
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}
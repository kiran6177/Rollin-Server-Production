import { UserModel } from "../../database/index.js";

class UserRepository{
    async createUser(){
        throw new Error('CreateUser not implemented!!');
    }
    async findUserById(){
        throw new Error('findUserById not implemented!!');
    }
    async deleteUserById(){
        throw new Error('deleteUserById not implemented!!');
    }
    async findUserByEmail(){
        throw new Error('findUserByEmail not implemented!!');
    }
    async updateUserById(){
        throw new Error('updateUserById not implemented!!');
    }
    async getUsersCountByDate(){
        throw new Error('getUsersCountByDate not implemented!!');
    }
}

export class MongoUserRepository extends UserRepository{
    async createUser(userData){
        userData.createdAt = new Date()
        return await UserModel.create(userData);
    }
    async findUserByEmail(email){
        try {
            return await UserModel.findOne({email})
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async findUserById(id){
        try {
            return await UserModel.findById({_id:id})
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async updateUserById(id,data){
        try {
            return await UserModel.findByIdAndUpdate({_id:id},{$set:data},{new:true})
        } catch (err) {
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getUsersCountByDate(startDate,endDate){
        try {
            return await UserModel.aggregate([{$match:{createdAt:{$gte:startDate,$lte:endDate}}},{$count:'totalCount'}]) 
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}
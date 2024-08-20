import {PersonModel} from '../../database/index.js'
class PersonRepository{
    async createPerson(){
        throw new Error('createPerson not implemented')
    }
    async findPersonById(){
        throw new Error('findPersonById not implemented')
    }
    async updatePersonById(){
        throw new Error('updatePersonById not implemented')
    }
    async findPersonByPersonId(){
        throw new Error('findPersonByPersonId not implemented')
    }
    async GetPeopleWithLimit(){
        throw new Error('GetPeopleWithLimit not implemented')
    }
    async GetPersonWithId(){
        throw new Error('GetPersonWithId not implemented')
    }
}

export class MongoPersonRepository extends PersonRepository{

    async createPerson(data){
        try {
            const person = new PersonModel(data)
            return await person.save();
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findPersonByPersonId(id){
        try {
            return await PersonModel.findOne({person_id:id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async GetPeopleWithLimit(skip,limit){
        try {
            return await PersonModel.find().skip(skip).limit(limit).lean()
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async GetPersonWithId(id){
        try {
            return await PersonModel.findById({_id:id}).lean()
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}
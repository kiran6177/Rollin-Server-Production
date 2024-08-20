import {MovieModel} from '../../database/index.js'
class MovieRepository{
    async createMovie(){
        throw new Error('createMovie not implemented')
    }
    async findMovieById(){
        throw new Error('findMovieById not implemented')
    }
    async updateMovieRatingById(){
        throw new Error('updateMovieRatingById not implemented')
    }
    async findMovieByMovieId(){
        throw new Error('findMovieByMovieId not implemented')
    }
    async GetMoviesAndPeopleWithLimit(){
        throw new Error('GetMoviesAndPeopleWithLimit not implemented')
    }
    async GetMoviesAndPeopleWithLimitAndFilter(){
        throw new Error('GetMoviesAndPeopleWithLimitAndFilter not implemented')
    }
    async findMovieByPersonId(){
        throw new Error('findMovieByPersonId not implemented')
    }
    async findMoviesByDateWithLimit(){
        throw new Error('findMoviesByDateWithLimit not implemented')
    }
    async findMoviesByGenreWithLimit(){
        throw new Error('findMoviesByGenreWithLimit not implemented')
    }
    async findMovieByMovieIdWithPeople(){
        throw new Error('findMovieByMovieIdWithPeople not implemented')
    }
    async manageMovieById(){
        throw new Error('manageMovieById not implemented')
    }
    async updateMovieStatus(){
        throw new Error('updateMovieStatus not implemented')
    }
    async getMovieByQuery(){
        throw new Error('getMovieByQuery not implemented')
    }
    async getRecentMoviesByLimit(){
        throw new Error('getRecentMoviesByLimit not implemented')
    }
}

export class MongoMovieRepository extends MovieRepository{

    async createMovie(data){
        try {
            const movie = new MovieModel(data)
            return await movie.save();
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findMovieByMovieId(id){
        try {
            return await MovieModel.findOne({movie_id:id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async findMovieById(id){
        try {
            return await MovieModel.findById({_id:id})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async updateMovieRatingById(id,rating){
        try {
            return await MovieModel.findByIdAndUpdate({_id:id},{$set:{rating}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async GetMoviesAndPeopleWithLimit(skip,limit){
        try {
            return await MovieModel.find().skip(skip).limit(limit).populate('cast.cast_id').populate('crew.crew_id').lean();
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async GetMoviesAndPeopleWithLimitAndFilter(filters,skip,limit){
        try {
            const {page,languages,genres,search} = filters;
            console.log(languages);
            console.log("ff",genres);
            let filterQuery = [];
            if(!search){
                filterQuery.push({isDisabled:false})
            }
            if(languages?.length > 0){
                filterQuery.push({
                    language:{$in:languages}
                })
            }
            if(genres?.length > 0){
                filterQuery.push({
                    ['genres.name']:{$in:genres}
                })
            }
            const searchQuery = {title:{$regex:search ? search : '',$options:'i'}}
            console.log("FILTER",filterQuery);
            if(filterQuery.length > 0 && search !== ''){
                filterQuery.push(searchQuery)
                console.log("FILTER",filterQuery);
                return await MovieModel.find({$and:filterQuery}).skip(skip).limit(limit).populate('cast.cast_id').populate('crew.crew_id').lean();
            }else if(filterQuery.length > 0 && search === ''){
                return await MovieModel.find({$and:filterQuery}).skip(skip).limit(limit).populate('cast.cast_id').populate('crew.crew_id').lean();
            }else{
                return await MovieModel.find(searchQuery).skip(skip).limit(limit).populate('cast.cast_id').populate('crew.crew_id').lean();
            }
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async findMovieByPersonId(id){
        try {
            return await MovieModel.find({$or: [
                { "cast.cast_id": id },
                { "crew.crew_id": id }
            ]}).lean()
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }

    async findMoviesByDateWithLimit(dateVal,limit){
        try {
            return await MovieModel.aggregate([{$sort:{release_date:dateVal}},{$limit:limit}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findMoviesByGenreWithLimit(limit){
        try {
            return await MovieModel.aggregate([
                {$unwind:'$genres'},
                {$sort:{
                    release_date:-1
                }},
                {$group:
                    {_id:'$genres',movies:{$addToSet:"$$ROOT"}}
                },
                {$project:{
                    _id:1,
                    movies:{
                        $slice:["$movies",limit]
                    }
                }}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async findMovieByMovieIdWithPeople(id){
        try {
            return await MovieModel.findOne({_id:id}).populate('cast.cast_id').populate('crew.crew_id').lean();
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async manageMovieById(id,state){
        try {
            return await MovieModel.findByIdAndUpdate({_id:id},{$set:{isDisabled:state}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async updateMovieStatus(id,status){
        try {
            return await MovieModel.findByIdAndUpdate({_id:id},{$set:{isAssigned:status}},{new:true})
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getMovieByQuery(query){
        try {
            return await MovieModel.aggregate([{$match:{title:{$regex:new RegExp(query,'i')}}}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
    async getRecentMoviesByLimit(limit){
        try {
            return await MovieModel.aggregate([{$sort:{createdAt:-1}},{$limit:limit}])
        } catch (err) {
            console.log(err);
            const error = new Error();
            error.statusCode = 500;
            error.reasons = [err.message]
            throw error
        }
    }
}
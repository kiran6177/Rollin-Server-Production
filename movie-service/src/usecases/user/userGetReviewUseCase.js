export class UserReviewGet{
    constructor(dependencies){
        this.reviewRepository = new dependencies.Repositories.MongoReviewRepository()
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
    }

    async execute({page,movie_id}){
        try {
            const pageFrom = page ? page : 1;
            console.log(movie_id,pageFrom);
            const LIMIT = 10;
            const skip = (pageFrom - 1) * LIMIT
            const reviewsList = await this.reviewRepository.getReviewsByMovieIDWithUserByFilters(movie_id,skip,LIMIT)
            console.log(reviewsList);
            const hashtags = {}
            reviewsList.map(review=>{
                if(review?.hashtags?.length > 0){
                    review?.hashtags.map(tag=>{
                        if(hashtags[tag]){
                            hashtags[tag] = hashtags[tag]+1;
                        }else{
                            hashtags[tag] = 1;
                        }
                    })
                }
            })
            console.log(hashtags);
            return {hashtags,reviewsList}
        }catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
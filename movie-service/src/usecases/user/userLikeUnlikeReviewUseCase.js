export class UserReviewLikeUnlike{
    constructor(dependencies){
        this.reviewRepository = new dependencies.Repositories.MongoReviewRepository()
    }

    async execute({review_id,state},{id}){
        try {
            if(review_id && state){
                console.log(review_id,state);
                const isExisted = await this.reviewRepository.getReviewByID(review_id)
                let result;
                if(state === "LIKE"){
                    if(isExisted?.likedUsers.includes(id.toString())){
                        const error = new Error()
                        error.statusCode = 400;
                        error.reasons = ['Unable to like again!!']
                        throw error
                    }
                  result = await this.reviewRepository.hitLikeByReviewId(review_id,id)
                }else{
                    if(isExisted?.dislikedUsers.includes(id.toString())){
                        const error = new Error()
                        error.statusCode = 400;
                        error.reasons = ['Unable to dislike again!!']
                        throw error
                    }
                  result = await this.reviewRepository.hitDisLikeByReviewId(review_id,id)
                }
                return result.toObject()
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid Inputs!!']
                throw error
            }
        }catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
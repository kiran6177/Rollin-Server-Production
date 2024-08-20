import { Review } from "../../entities/reviewEntity.js";

export class UserReviewAdd{
    constructor(dependencies){
        this.reviewRepository = new dependencies.Repositories.MongoReviewRepository()
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
    }

    async execute({stars,review,movie_id},{id}){
        try {
            if(stars?.length === 5 && review.trim() !== '' && movie_id && id){
                let rating = 0;
                for(let star of stars){
                    if(star){
                        rating+=2
                    }
                }
                let hashtags = []
                review.split(" ").forEach(word=>{
                    if(/^[#]/.test(word)){
                        hashtags.push(word)
                    }
                })
                const reviewObj = new Review({
                    hashtags,
                    content:review,
                    rating,
                    movie_id,
                    user_id:id
                })
                console.log("REviewData",reviewObj);
                const addedReview = await this.reviewRepository.addReview(reviewObj)
                if(addedReview){
                    const updateRating = async (movie_id)=>{
                        const reviewsList = await this.reviewRepository.getReviewsByMovieID(movie_id)
                        if(reviewsList?.length > 0){
                            let totalRating = 0;
                            for(let obj of reviewsList){
                                totalRating+=obj.rating
                            }
                            let avgRating = Math.floor(totalRating/reviewsList?.length)
                            console.log("AVERAGE",avgRating);
                            await this.movieRepository.updateMovieRatingById(movie_id,avgRating)
                        }
                    }
                    updateRating(movie_id)//Making it non-blocking for updating rating with calculations.
                }
                console.log("COMPLETED");
                return true
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
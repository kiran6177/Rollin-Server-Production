export class Review{
    constructor(review){
        this.movie_id = review.movie_id
        this.user_id = review.user_id
        this.content = review.content
        this.rating = review.rating
        this.hashtags = review.hashtags
    }
}
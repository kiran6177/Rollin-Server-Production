export class Movie{
    constructor(movie){
        this.movie_id = movie.movie_id
        this.title = movie.title
        this.language = movie.language
        this.overview = movie.overview
        this.release_date = movie.release_date
        this.popularity = movie.popularity
        this.rating = movie.rating
        this.genres = movie.genres
        this.video_link = movie.video_link
        this.runtime = movie.runtime
        this.backdrop_path = movie.backdrop_path
        this.poster_path = movie.poster_path
        this.cast = movie.cast
        this.crew = movie.crew
        this.createdAt = movie.createdAt
    }
}
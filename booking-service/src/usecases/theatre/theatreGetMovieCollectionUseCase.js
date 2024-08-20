export class TheatreMovieCollectionGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
    }

    async execute(query,{id}){
        try {
            let screenData = await this.theatreRepository.findTheatreById(id)
            const screens = screenData?.screens || [];
            console.log(screens);
            const moviesList = new Set();
            const collections = [] 

            for(let screenId of screens){
                const screenDetails = await this.screenRepository.findScreenById(screenId)
                if(screenDetails?.running_movies?.length > 0){
                    for(let movie of screenDetails?.running_movies){
                        if(!moviesList.has(movie)){
                            const collectionOfMovie = await this.orderRepository.getCollectionByMovie(id,movie?.movie_id)
                            collections.push([movie?.title , collectionOfMovie?.length > 0 ? collectionOfMovie[0]?.totalAmount : 0])
                            moviesList.add(movie) 
                        }
                    }
                }
            }
            
            console.log(collections);
            return collections
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
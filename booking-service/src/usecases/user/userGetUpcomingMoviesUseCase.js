import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'
const UNKNOWN_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLVQWm0gocTw1yyhcV1sEMyfrenm4uYHF1HeYmZtq6g&s'


export class UserUpcomingMoviesGet{
    constructor(dependencies){
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({location},userdata){
        try {
            console.log(location);
            console.log("USER",userdata);
            let upcomingMovies = []
            let userSpecficMovies = []
            if(location?.lat && location?.lng){
                const theatres = await this.theatreRepository.findMoviesFromTheatreByLocation([location.lat,location.lng],50)
                console.log("BY LOC",theatres);
                let screenIds = []
                if(theatres?.length > 0){
                    theatres.forEach(theatre=>{
                        screenIds.push(...theatre?.screens)
                    })
                }
                console.log("SCREN",screenIds);
                const today = new Date()
                today.setUTCHours(0,0,0,0)
                console.log("TODAY",today);
                let currentMovieIds = []
                if(screenIds?.length > 0){
                    for(let screenID of screenIds){
                        const screenData = await  this.screenRepository.findScreenById(screenID)
                        // screenData.showtimes.forEach(showObj=>{
                        //     if(showObj?.movie_id){
                        //         currentMovieIds.push(showObj.movie_id)
                        //     }
                        // })
                        if(screenData?.running_movies?.length > 0){
                            for(let eachMovie of screenData?.running_movies){
                                if(new Date(eachMovie?.release_date) > today || !eachMovie?.isAssigned){
                                    upcomingMovies.push(eachMovie)
                                }
                            }
                        }
                    }
                }
                //REMOVING_DUPLICATE
                upcomingMovies = upcomingMovies.filter((movie, index, arr) => 
                    index === arr.findIndex((m) => (
                        m.movie_id === movie.movie_id
                    ))
                );
                console.log("UPCOM",upcomingMovies);
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid Location Inputs!!']
                throw error
            }
            if(userdata?.id){
                let genres = new Set()
                const ordersData = await this.orderRepository.getOrdersByUserIdWithPage(userdata.id,5,0)//last five orders
                if(ordersData?.length > 0){
                    ordersData.forEach(order=>{
                        for(let genre of order?.movie?.genres){
                        genres.add(genre.id)
                        }
                    })
                }
                const sortedSpecficGenre = Array.from(genres)
                upcomingMovies.forEach(movie=>{
                    for(let eachGenre of movie?.genres){
                        if(sortedSpecficGenre.includes(eachGenre?.id)){
                             userSpecficMovies.push(movie)
                             break;
                        }
                    }
                })
            }
            console.log("GENRES",userSpecficMovies);
            let resultMovies = []
            if(userSpecficMovies?.length > 0 ){
                if(userSpecficMovies.length >= 6){
                    for(let i = 0 ; i < 6 ; i++){
                        resultMovies.push(upcomingMovies[i])
                    }
                }else{
                    let remaining = 6 - userSpecficMovies.length;
                    resultMovies = [...userSpecficMovies]
                    for(let i = 0 ; i < remaining ; i++){
                        if(upcomingMovies[i]){
                            resultMovies.push(upcomingMovies[i])
                        }
                    }
                }
            }else{
                for(let i = 0 ; i < 6 ; i++){
                    if(upcomingMovies[i]){
                        resultMovies.push(upcomingMovies[i])
                    }
                }
            }
            resultMovies = resultMovies.filter((movie, index, arr) => 
                index === arr.findIndex((m) => (
                    m.movie_id === movie.movie_id
                ))
            );
            console.log("RESSSSs",resultMovies);

            let outputData = []
                for(let movieObj of resultMovies){
                    let movie = movieObj.toObject()
                    const backdrop_path = await this.awsConfig.getImage(movie?.backdrop_path,MOVIE_OWNER)
                    const poster_path = await this.awsConfig.getImage(movie?.poster_path,MOVIE_OWNER)
                    let castDataImg = []
                    let crewDataImg = []
                    let genres = []
                        for(let genre of movie.genres){
                            genres.push(genre.name)
                        }

                        for(let castData of movie.cast){
                                let profile_path;
                                if(castData?.profile_path){
                                    let url = await this.awsConfig.getImage(castData.profile_path,PEOPLE_OWNER)
                                    if(url){
                                        profile_path = url;
                                    }else{
                                        profile_path = UNKNOWN_IMAGE
                                    }
                                }else{
                                    profile_path = UNKNOWN_IMAGE
                                }
                                castDataImg.push({
                                    ...castData,
                                    profile_path,
                                    character:castData.character
                                })
                        }

                        for(let crewData of movie.crew){
                            let profile_path;
                                if(crewData?.profile_path){
                                    let url = await this.awsConfig.getImage(crewData.profile_path,PEOPLE_OWNER)
                                    if(url){
                                        profile_path = url;
                                    }else{
                                        profile_path = UNKNOWN_IMAGE
                                    }
                                }else{
                                    profile_path = UNKNOWN_IMAGE
                                }
                                crewDataImg.push({
                                    ...crewData,
                                    profile_path,
                                })
                        }
                    let release_date = new Date(movie.release_date)
                    outputData.push({
                        ...movie,
                        _id:movie.movie_id,
                        backdrop_path,
                        poster_path,
                        release_date:release_date.getFullYear()+'-'+((release_date.getMonth()+1) < 10 ? '0'+(release_date.getMonth()+1) : release_date.getMonth()+1)+'-'+release_date.getDate(),
                        cast:castDataImg,
                        crew:crewDataImg,
                        genres,
                    })  
                }
                console.log("Out",outputData);
            return outputData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
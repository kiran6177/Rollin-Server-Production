import { getShowDate } from "../../utils/getShowDate.js";

export class UserShowDataGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
    }

    async execute({date,theatre_id}){
        try {
            if(date && theatre_id){
                const showData = await this.reservationRepository.getShowDataByTheatreIdAndDate(theatre_id,date);
                console.log(showData);
                const resultData = showData.map(show=>{
                    let updatedShow;
                    let filteredShows = []
                    for(let showObj of show.shows){
                        console.log("SHOW========>",showObj.reserved_date,showObj.showtime);
                        const showDate =  getShowDate(showObj.reserved_date,showObj.showtime)
                        const now = new Date()
                        if(showDate > now){
                            filteredShows.push(showObj)
                        }
                    }
                    filteredShows[0]?.screenData[0]?.running_movies.map(movie=>{
                        if(show._id.toString() == movie?.movie_id){
                            updatedShow = {
                                ...show,
                                shows:filteredShows,
                                movie
                            }
                        }
                    })
                    console.log("Up",updatedShow);
                    return updatedShow
                })
                console.log(resultData);
                return resultData?.length > 0 ? resultData.filter(each=>each != undefined) : []
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid input data!!'];
                throw error;
            }
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
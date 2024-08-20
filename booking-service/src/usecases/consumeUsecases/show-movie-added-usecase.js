import { getMidDate } from "../../utils/dateToMid.js";
import { getShowDates } from "../../utils/showCreationDates.js";
import { ObjectId } from "mongodb";

export class ShowAddedUseCase{
    constructor(dependencies){
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
    }

    async execute(data){
        try {
            console.log("SHOWMOVIE");
            const {screenData,showdata} = data
            const { showtime,movie_id,_id } = showdata
            const theatreData = await this.theatreRepository.getTheatreByScreenId(screenData._id)
            const {enroll_from,enroll_to} = screenData.running_movies.find(movie=>movie.movie_id === movie_id)
            const today = getMidDate()
            let startDate;
            if(enroll_from <= today){
                startDate = today
            }else{
                startDate = enroll_from
            }
            const dates = await getShowDates(startDate,enroll_to)
            console.log("DATES",dates);
            const reservationsConv = screenData.tiers.map(tier=>{
                return tier.layout.map(seat=>{
                    let seatNumber = 0;
                    const data = Object.values(seat)[0].map((obj,i)=>{
                        if(obj === 1){
                            seatNumber++;
                            return {
                                status:"AVAILABLE",
                                user_id:null,
                                seat_number:Object.keys(seat)[0]+seatNumber
                            }
                        }else{
                            return {
                                status:"INVALID",
                                user_id:null
                            }
                        }
                    })
                    return {
                        [Object.keys(seat)[0]] : data
                    }
                })
                
            })
            const reservationsUnSorted = reservationsConv.flat(1)
            const reservations = reservationsUnSorted.sort((a,b)=>{
                const keyA = Object.keys(a)[0]    
                const keyB = Object.keys(b)[0]
                return keyA.localeCompare(keyB)
            })
            console.log("RESERVATIONS",reservations);
            // console.log(reservations[0].A[0]);
            // console.log(reservations[0].A[7]);
            for(let date of dates){
                const data = {
                    show_id:_id,
                    showtime,
                    screen_id:new ObjectId(screenData._id),
                    theatre_id:theatreData[0]._id,
                    reserved_date:date,
                    reservations,
                    movie_id
                }
                await this.reservationRepository.addReservationData(data)
            }
            // if(addScreen){
            //     console.log("SCREEN CREATED");
            // }else{
            //     console.log("UNABLE TO CREATE SCREEN");
            // }
            return
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
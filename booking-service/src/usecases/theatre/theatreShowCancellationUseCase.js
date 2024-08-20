import { scheduleBookingsEndNotification } from "../../utils/scheduler.js";

export class TheatreShowCancellation{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
    }

    async execute({screen_id,showdata}){
        try {
            console.log(screen_id,showdata);
            const {showtime,_id} = showdata
            if(screen_id){ 
                const screenValid = await this.screenRepository.findScreenById(screen_id)
                if(screenValid){
                    const date = new Date()
                    date.setUTCHours(0,0,0,0)
                    console.log("TODAYS",date);
                    const bookingData = await this.reservationRepository.getShowReservations(showtime,_id,date)
                    let hasBookings = false;
                    let hasData = false;
                    let hasFilledBookings = false;
                    let hasFilledDates = 0;
                    let maxdate ;
                    const dates = new Set();
                    if(bookingData?.length > 0){
                        hasData = true
                        for(let doc of bookingData){
                            if(doc?.reservations?.length > 0){
                                for(let seatObj of doc.reservations){
                                    Object.values(seatObj)[0].map(obj=>{
                                        if(obj.status !== 'INVALID' && obj.status !== 'AVAILABLE'){
                                            dates.add(doc.reserved_date)
                                            if(maxdate === undefined){
                                                maxdate = doc.reserved_date
                                            }else if(maxdate < doc.reserved_date){
                                                maxdate = doc.reserved_date
                                            }
                                        }
                                    })
                                }
                            }
                        }
                        console.log("DAATES",dates);
                        if(dates?.size > 0){
                            hasBookings = true;
                        }
                        if(dates?.size === bookingData.length){
                            hasFilledBookings = true;
                            hasFilledDates = dates.size;
                        }
                    }
                    if(hasBookings && hasData){ //DELETE SHOWS BELOW BOOKED DATE
                        console.log("BOOKINGS EXCEPT DELETE",maxdate);
                        for(let doc of bookingData){
                            if(maxdate < doc.reserved_date){
                                console.log(doc.reserved_date);
                                await this.reservationRepository.removeShowBookingsBasedOnDate(_id,doc.reserved_date)
                            }
                        }
                        console.log("SCHEDULE==================>");
                        //SCHEDULED_FOR_ENDING_DATE_TO_NOTIFY_BOOKING_ENDING(10:00AM)
                        const notifyDate = new Date(maxdate);//maxdate
                        notifyDate.setHours(10,0,0,0)
                        const screendata = {
                            screen_id,
                            screen_name:screenValid?.name,
                            movie_id:bookingData[0]?.movie_id
                        }
                        const showdata = {
                            show_time:showtime,
                            show_id:bookingData[0]?.show_id,
                            movie_id:bookingData[0]?.movie_id
                        }
                        const enrolledMovie = await this.screenRepository.findMovieEnrolled(screen_id,bookingData[0]?.movie_id.toString());
                        console.log(notifyDate,bookingData[0]?.theatre_id,enrolledMovie[0]?.running_movies,showdata,screendata);
                        scheduleBookingsEndNotification(notifyDate,bookingData[0]?.theatre_id,enrolledMovie[0]?.running_movies,showdata,screendata)
                    }else{ //DELETE ALL UNBOOKED SHOWS
                        console.log("UNBOOOKED DELETE");
                        for(let doc of bookingData){
                            if(doc?.reserved_date){
                                await this.reservationRepository.removeShowBookingsBasedOnDate(_id,doc.reserved_date)
                            }
                        }
                        
                    }
                    return true
                 }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['Invalid screen data!!'];
                    throw error;
                }
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid screen data!!'];
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
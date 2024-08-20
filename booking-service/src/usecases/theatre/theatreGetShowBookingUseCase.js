export class TheatreShowBookingGet{
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
                    console.log("da",date);
                    const bookingData = await this.reservationRepository.getShowReservations(showtime,_id,date)
                    let hasBookings = false;
                    let hasData = false;
                    let hasFilledBookings = false;
                    let hasFilledDates = 0;
                    let maxdate ;
                    if(bookingData?.length > 0){
                        hasData = true
                        const dates = new Set();
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
                        let farthestDate ;
                        for(let dateOfBooking of bookingData){
                            if(farthestDate === undefined){
                                farthestDate = dateOfBooking.reserved_date
                            }else if(farthestDate < dateOfBooking.reserved_date){
                                farthestDate = dateOfBooking.reserved_date
                            }
                        }
                        if(farthestDate === maxdate){
                            console.log("NOTHING TO REMOVE",farthestDate,maxdate);
                            const today = new Date();
                            today.setUTCHours(0,0,0,0)
                            const millisecondOfDay = 24 * 60 * 60 * 1000;
                            const difference = maxdate - today;
                            const dayDiff = difference / millisecondOfDay;
                            console.log(dayDiff);
                            hasFilledBookings = true
                            hasFilledDates = dayDiff
                        }
                        if(dates?.size > 0){
                            hasBookings = true;
                        }
                        console.log("LENGTHS",dates?.size,bookingData.length);
                        if(dates?.size === bookingData.length){
                            hasFilledBookings = true;
                            hasFilledDates = dates.size;
                        }
                    }
                    console.log(hasFilledBookings,hasFilledDates);
                    return {hasBookings,hasData,hasFilledBookings,hasFilledDates}
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
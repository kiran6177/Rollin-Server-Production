export class UserReserveSeat{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
    }

    async execute({date,show_id,seatData},{id}){
        try {
            console.log(date,seatData,show_id);
            console.log("USERID",id);
            if(seatData?.length > 0 && date && show_id && id){
                const showData = await this.reservationRepository.findShowByShowIdandDate(show_id,date)
                console.log(showData);
                const identifiers = seatData.map(seat=>seat.replace(/\d/g,""))
                console.log("ID",identifiers);
                console.log(seatData);
                let reservationCount = 0;
                const updatedReservations = showData?.reservations.map(rowObj=>{
                    const key = Object.keys(rowObj)[0]
                    if(identifiers.includes(key)){
                        const values = Object.values(rowObj)[0]
                        const newValues = values.map(seatObj=>{
                            if(seatData.includes(seatObj.seat_number) && seatObj.status === 'AVAILABLE'){
                                reservationCount++;
                                return {
                                    ...seatObj,
                                    status:"RESERVED",
                                    user_id:id
                                }
                            }
                            return seatObj
                        })
                        return {
                            [key] : newValues
                        }
                    }
                    return rowObj
                })
                console.log("UP",updatedReservations);
                console.log("APPROVAL",reservationCount,seatData?.length);
                let approved = false;                
                if(reservationCount === seatData?.length){
                    const updatedShow = await this.reservationRepository.updateReservationsById(showData?._id,updatedReservations)
                    setTimeout(async ()=>{
                        let isSold = true; 
                        const newShowData = await this.reservationRepository.findShowByShowIdandDate(show_id,date)
                        const revisedReservations = newShowData?.reservations.map(rowObj=>{
                            const key = Object.keys(rowObj)[0]
                            if(identifiers.includes(key)){
                                const values = Object.values(rowObj)[0]
                                const newValues = values.map(seatObj=>{
                                    if(seatData.includes(seatObj.seat_number) && seatObj.status !== 'SOLD'){
                                        isSold = false;
                                        return {
                                            ...seatObj,
                                            status:"AVAILABLE",
                                            user_id:null
                                        }
                                    }
                                    return seatObj
                                })
                                return {
                                    [key] : newValues
                                }
                            }
                            return rowObj
                        })
                        if(!isSold){
                            await this.reservationRepository.updateReservationsById(newShowData?._id,revisedReservations)
                            console.log("RESERVATION RESET");
                        }
                        console.log('SEAT SOLD');
                    },300000) //5 minutes(300000) delay for RESERVED resetting to AVAILABLE if not SOLD

                    approved = true;
                }
                return approved
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
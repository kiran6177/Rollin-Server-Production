import { CashfreeClient } from "../../utils/cashfreeConfig.js";
import { randomInt } from "crypto";

export class UserInitiatePayment {
  constructor(dependencies) {
    this.theatreRepository =
      new dependencies.Repositories.MongoTheatreRepository();
    this.screenRepository =
      new dependencies.Repositories.MongoScreenRepository();
    this.reservationRepository =
      new dependencies.Repositories.MongoReservationRepository();
    this.userRepository = new dependencies.Repositories.MongoUserRepository();
    this.orderRepository = new dependencies.Repositories.MongoOrderRepository();
    this.cashfreeClient = new CashfreeClient();
  }

  async execute({ date, show_id, selectedSeats ,userDetails}, { id }) {
    try {
      // console.log(date, selectedSeats, show_id, id,userDetails);
      if (date && selectedSeats?.length > 0 && show_id && id && userDetails) {
        const userData = await this.userRepository.findUserById(id);
        if (userData) {
            const showData = await this.reservationRepository.findShowByShowIdandDate(show_id,date)
                console.log(showData);
                const identifiers = selectedSeats.map(seat=>seat.replace(/\d/g,""))
                let reservationCount = 0;
                let updatedReservations =  showData?.reservations.map(rowObj=>{
                    const key = Object.keys(rowObj)[0]
                    if(identifiers.includes(key)){
                        const values = Object.values(rowObj)[0]
                        const newValues = values.map(seatObj=>{
                            if(selectedSeats.includes(seatObj.seat_number) &&
                             seatObj.status === 'RESERVED' && 
                             seatObj.user_id.toString() === id ){
                                reservationCount++
                                console.log(seatObj);
                                return {
                                  ...seatObj,
                                  status:'SOLD'
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
                console.log("UPD",updatedReservations[0]);
                if(reservationCount === selectedSeats?.length){
                    const order_id = "RMT" + randomInt(0, 281474976710655);
                    const screenData = await this.screenRepository.findScreenById(showData?.screen_id)
                    let tierData = {}
                    let billing_amount = 0
                    selectedSeats.forEach(seat=>{
                        const id = seat.replace(/\d/g,"")
                        screenData?.tiers.forEach(tier=>{
                          tier.layout.forEach(seatObj=>{
                            const key = Object.keys(seatObj)[0]
                            if(key === id){
                              if(tierData[id]){
                                tierData[id] = {
                                  ...tierData[id],
                                  seats:[...tierData[id].seats,seat]
                                }
                              }else{
                                tierData[id] = {
                                  tier_name:tier.name,
                                  rate:tier.rate,
                                  seats:[seat]
                                }
                              }
                              billing_amount += tier.rate
                            }
                          })
                        })
                    })
                    let movie;
                    for(let movieObj of screenData?.running_movies){
                      if(movieObj.movie_id.toString() === showData?.movie_id.toString()){
                        const { enroll_from, enroll_to, status, _id, ...rest } = movieObj.toObject();
                        movie = rest;
                      }
                    }

                    const data = {
                      order_id,
                      attachment_details:{
                        email:userDetails?.email,
                        mobile:userDetails?.mobile
                      },
                      show_id,
                      show_date:date,
                      show_time:showData.showtime,
                      seatdata:Object.values(tierData),
                      billing_amount,
                      user_id:id,
                      theatre_id:showData?.theatre_id,
                      screendata:{
                        screen_id:screenData._id,
                        screen_name:screenData.name
                      },
                      movie
                    }
                    const createdOrder = await this.orderRepository.createOrder(data)
                    console.log("ORDER",createdOrder);
                    const response = await this.cashfreeClient.createOrder(
                      order_id,
                      id,
                      userDetails?.email,
                      userData?.firstname + " " + userData?.lastname,
                      userDetails?.mobile,
                      billing_amount
                    );
                    console.log(response);
                    if (response) {
                      const { payment_session_id, order_id } = response;
                      let payment_status = false;
                      if (payment_session_id) {
                        payment_status = payment_session_id;
                      }
                      const updatedOrder = await this.orderRepository.updateOrderById(createdOrder._id,{payment_session_id})
                      const updatedShow = await this.reservationRepository.updateReservationsById(showData?._id,updatedReservations)
                      return { payment_status, order_id };
                      
                    } else {
                      const error = new Error();
                      error.statusCode = 400;
                      error.reasons = ["Invalid input data!!"];
                      throw error;
                    }
                }else{
                    const error = new Error();
                    error.statusCode = 400;
                    error.reasons = ["Invalid Seat booked!!"];
                    throw error;
                }
        } else {
          const error = new Error();
          error.statusCode = 400;
          error.reasons = ["Invalid user data!!"];
          throw error;
        }
      } else {
        const error = new Error();
        error.statusCode = 400;
        error.reasons = ["Invalid input data!!"];
        throw error;
      }
    } catch (err) {
      console.log(err);
      const error = new Error();
      error.statusCode = err.statusCode;
      error.reasons = err.reasons;
      throw error;
    }
  }
}

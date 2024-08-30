import { CashfreeClient } from "../../utils/cashfreeConfig.js";
import { generateQrCode } from "../../utils/generateQrCode.js";
import { AwsConfig } from '../../utils/aws-s3.js'
import { scheduleBookingNotification } from "../../utils/scheduler.js";
import { getShowDate } from "../../utils/getShowDate.js";
const MOVIE_OWNER = 'movie';

export class UserProcessPayment{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository();
        this.cashfreeClient = new CashfreeClient()
        this.awsConfig = new AwsConfig()
    }

    async execute({order_id},{id}){
        try{        
            console.log("HI",order_id,id);
            if(!order_id){
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid input data!!'];
                throw error;
            }
            const response = await this.cashfreeClient.getOrderStatus(order_id)
            console.log(response);
            const orderData = await this.orderRepository.findOrderByOrderId(order_id)
            console.log("ORDERDATA",orderData);
            let orderStatus
            if(response?.length > 0){
                if(response.filter(transaction => transaction?.payment_status === "SUCCESS").length > 0){
                    orderStatus = "SUCCESS"
                }else if(response.filter(transaction => transaction?.payment_status === "PENDING").length > 0){
                    orderStatus = "PENDING"
                }else{
                    orderStatus = "FAILURE"
                }
            }else{
                orderStatus = "USER_DROPPED"
            }
            if(orderStatus === 'SUCCESS'){
                await this.orderRepository.updateOrderById(orderData._id,{payment_status:"PAID"})
                const updatedOrder = await this.orderRepository.findOrderByOrderId(orderData?.order_id)
                const url = await generateQrCode(orderData?.order_id)
                let movieWithPic;
                const backdrop_path = await this.awsConfig.getImage(updatedOrder?.movie?.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(updatedOrder?.movie?.poster_path,MOVIE_OWNER)
                movieWithPic = {
                    ...updatedOrder?.toObject()?.movie,
                    backdrop_path,
                    poster_path
                }
                console.log("SCHEDULE===============>");
                //NOTIFY_BEFORE_2_HOURS_OF_SHOW
                const notifyDate = getShowDate(updatedOrder?.show_date,updatedOrder?.show_time)
                notifyDate.setHours(notifyDate.getHours() - 2)
                // const notifyDate = new Date()
                // notifyDate.setHours(13,31,0,0)
                console.log("NOTIFYDATE",notifyDate);
                scheduleBookingNotification(notifyDate,updatedOrder)
                return {...updatedOrder.toObject(),movie:movieWithPic,qr_url:url}
            }else{
                let selectedSeats = orderData?.seatdata.map(each=>each.seats).flat(Infinity)
                const showData = await this.reservationRepository.findShowByShowIdandDate(orderData?.show_id,orderData?.show_date)
                const identifiers = selectedSeats.map(seat=>seat.replace(/\d/g,""))
                let updatedReservations =  showData?.reservations.map(rowObj=>{
                    const key = Object.keys(rowObj)[0]
                    if(identifiers.includes(key)){
                        const values = Object.values(rowObj)[0]
                        const newValues = values.map(seatObj=>{
                            if(selectedSeats.includes(seatObj.seat_number) &&
                             seatObj.status === 'SOLD' && 
                             seatObj.user_id.toString() === id ){
                                console.log(seatObj);
                                return {
                                  ...seatObj,
                                  status:'AVAILABLE',
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
                console.log("UPD",updatedReservations[0]);
                await this.reservationRepository.updateReservationsById(showData?._id,updatedReservations)
                await this.orderRepository.removeOrderById(orderData._id)
                console.log(orderStatus);
                return false
            }
        }catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
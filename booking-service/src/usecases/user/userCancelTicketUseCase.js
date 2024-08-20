import { CashfreeClient } from "../../utils/cashfreeConfig.js";
import { randomInt } from 'crypto'
import { getShowDate } from "../../utils/getShowDate.js";

export class UserTicketCancel{
    constructor(dependencies){
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
        this.cashfreeClient = new CashfreeClient()
    }

    async execute({order_id},{id}){
        try {
            console.log("CANCEL",order_id,id);
            if(!order_id){
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid input data!!'];
                throw error;
            }
            const orderData = await this.orderRepository.findOrderById(order_id)
            if(Math.abs(getShowDate(orderData?.show_date,orderData?.show_time) - new Date()) < 4 * 60 * 60 * 1000){
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Cancellation Unavailable!!'];
                throw error;
            }else{
                if(orderData?.order_id){
                    const refund_id = "REFUND" + randomInt(0, 281474976710655);
                    const refund_amount = orderData?.billing_amount;
                    console.log(refund_amount,refund_id,orderData?.order_id);
                    const response = await this.cashfreeClient.createRefund(orderData?.order_id,refund_id,refund_amount)
                    if(response){
                        console.log(response);
                        const dataToUpdate = {refund_id,refund_status:'PROCESSING'}
                        await this.orderRepository.updateOrderById(order_id,dataToUpdate)

                        //CHECKING_STATUS_OF_REFUND
                        const checkRefundStatus = async ()=>{
                            try {
                                console.log("CALLED");
                                const orderData = await this.orderRepository.findOrderById(order_id)
                                const refundStatusResponse = await this.cashfreeClient.getRefundStatus(orderData?.refund_id,orderData?.order_id)
                                if(refundStatusResponse?.refund_status === "SUCCESS"){
                                    const seatsMixedArray = orderData?.seatdata.map(seatObj=>{
                                        return seatObj.seats
                                    })
                                    const seatData = seatsMixedArray.flat(Infinity)
                                    const identifiers = seatData.map(seat=>seat.replace(/\d/g,""))
                                    const newShowData = await this.reservationRepository.findShowByShowIdandDate(orderData?.show_id,orderData?.show_date)
                                    const revisedReservations = newShowData?.reservations.map(rowObj=>{
                                        const key = Object.keys(rowObj)[0]
                                        if(identifiers.includes(key)){
                                            const values = Object.values(rowObj)[0]
                                            const newValues = values.map(seatObj=>{
                                                if(seatData.includes(seatObj.seat_number) && seatObj.status === 'SOLD'){
                                                    console.log(seatObj.seat_number,"NUMBER");
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
                                    console.log(revisedReservations[0],"SHOWDATA");
                                    await this.reservationRepository.updateReservationsById(newShowData?._id,revisedReservations)
                                    const dataToUpdate = {refund_status:'REFUNDED'}
                                    await this.orderRepository.updateOrderById(orderData?._id,dataToUpdate)
                                }else{
                                     setTimeout(checkRefundStatus,15000)//calling to check if refund not succeded to update refund status(15 sec) 
                                }
                            } catch (err) {
                                console.log(err);
                                const error = new Error()
                                error.statusCode = err.statusCode;
                                error.reasons = err.reasons;
                                throw error;
                            }
                        }
                        checkRefundStatus()
                        return true
                    }else{
                        const error = new Error()
                        error.statusCode = 400;
                        error.reasons = ['Error occured while initiating refund.!!'];
                        throw error;
                    }
                }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['Invalid Order!!'];
                    throw error;
                }
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
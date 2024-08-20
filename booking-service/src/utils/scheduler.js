import schedule from 'node-schedule';
import { KafkaService } from '../events/kafkaclient.js';
import { NOTIFICATION_TOPIC, TYPE_NOTIFICATION_CREATED } from '../events/config.js';

export const scheduleBookingNotification = (date,orderdata)=>{
    try {
        const dataToPub = {
            reciever_id:orderdata?.user_id,
            type:'SHOW_ALERT',
            orderdata,
            createdAt:date
        }
        const job = schedule.scheduleJob(date,()=>{
            try {
                const kafkaClient = new KafkaService()
                kafkaClient.produceMessage(NOTIFICATION_TOPIC,{
                    type:TYPE_NOTIFICATION_CREATED,
                    value:JSON.stringify(dataToPub)
                })
                console.log("JOB EXECUTED AT : ",date);
            } catch (error) {
                console.log("ERROR OCCURED ON JOB",error);
            }
        })
        console.log("BOOKING NOTIFICATION SCHEDULED FOR ",date);
    } catch (error) {
        console.log(error);
    }
}

export const scheduleBookingsEndNotification = (date,theatre_id,moviedata,showdata,screendata)=>{
    try {
        const dataToPub = {
            reciever_id:theatre_id,
            type:'BOOKINGS_ENDED',
            moviedata,
            showdata,
            screendata,
            createdAt:date
        }
        const job = schedule.scheduleJob(date,()=>{
            try {
                const kafkaClient = new KafkaService()
                kafkaClient.produceMessage(NOTIFICATION_TOPIC,{
                    type:TYPE_NOTIFICATION_CREATED,
                    value:JSON.stringify(dataToPub)
                })
                console.log("JOB EXECUTED AT : ",date);
            } catch (error) {
                console.log("ERROR OCCURED ON JOB",error);
            }
        })
        console.log("BOOKINGS ENDING NOTIFICATION SCHEDULED FOR ",date);
    } catch (error) {
        console.log(error);
    }
}
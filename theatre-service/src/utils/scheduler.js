import schedule from 'node-schedule';
import { KafkaService } from '../events/kafkaclient.js';
import { NOTIFICATION_TOPIC, TYPE_NOTIFICATION_CREATED } from '../events/config.js';
import { MongoScreenRepository } from '../adapters/repositories/index.js';
import { fromZonedTime } from 'date-fns-tz'

export const scheduleEnrollmentEndNotification = (date,theatre_id,moviedata,screendata)=>{
    try {
        const scheduledDate = fromZonedTime(date,'Asia/Kolkata');

        const dataToPub = {
            reciever_id:theatre_id,
            type:'ENROLLMENT_ENDED',
            moviedata,
            screendata,
            createdAt:scheduledDate
        }
        const job = schedule.scheduleJob(scheduledDate,async()=>{
            try {
                //CHECK_FOR_MOVIE_EXISTS_AND_ENROLLMENT_IS_ABOUT_TO_END
                const screenRepository = new MongoScreenRepository();
                const enrolledMovie = await screenRepository.findMovieEnrolled(screendata?.screen_id,moviedata?.movie_id);
                console.log(enrolledMovie);
                if(enrolledMovie[0]?.running_movies?.enroll_to){
                    const moviesLastDate = new Date(enrolledMovie[0]?.running_movies?.enroll_to)
                    const today = new Date();
                    const oneDay = 24 * 60 * 60 * 1000;
                    console.log(moviesLastDate,today);
                    const dayDifference = Math.floor((moviesLastDate - today)/oneDay);
                    console.log(dayDifference);
                    if(dayDifference < 2){
                        console.log("ABOUT TO NOTiFY");
                        const kafkaClient = new KafkaService()
                        kafkaClient.produceMessage(NOTIFICATION_TOPIC,{
                            type:TYPE_NOTIFICATION_CREATED,
                            value:JSON.stringify(dataToPub)
                        })
                    }else{
                     console.log("ENROLLMENT MAY EXTENDED");   
                    }
                }
                
                console.log("JOB EXECUTED AT : ",scheduledDate);
            } catch (error) {
                console.log("ERROR OCCURED ON JOB",error);
            }
        })
        console.log("ENROLLMENT ENDING NOTIFICATION SCHEDULED FOR ",scheduledDate);
    } catch (error) {
        console.log(error);
    }
}


import { sendTheatreNotification, sendUserNotification } from "../../socket.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';

export class NotificationCreate{
    constructor(dependencies){
        this.notificationRepository = new dependencies.Repositories.MongoNotificationRepository()
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute(data){
        try {
            console.log("NOTIFCATION",data);
            const notificationCreated = await this.notificationRepository.createNotification(data);
            console.log("CREATED",notificationCreated);
            
            let notificationWithMovieImage;
    
            let notification = notificationCreated.toObject();

            let updatedMovieData = {}
            let updatedOrderData = {}
            if(notification?.moviedata){
                const backdrop_path = await this.awsConfig.getImage(notification?.moviedata?.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(notification?.moviedata?.poster_path,MOVIE_OWNER)  
                updatedMovieData = {
                    ...notification.moviedata,
                    backdrop_path,
                    poster_path
                }                  
            }
            if(notification?.orderdata?.movie){
                const backdrop_path = await this.awsConfig.getImage(notification?.orderdata?.movie?.backdrop_path,MOVIE_OWNER)
                const poster_path = await this.awsConfig.getImage(notification?.orderdata?.movie?.poster_path,MOVIE_OWNER)
                const theatredata = await this.theatreRepository.findTheatreById(notification?.orderdata?.theatre_id) 
                updatedOrderData = {
                    ...notification?.orderdata,
                    movie:{
                        ...notification?.orderdata.movie,
                        backdrop_path,
                        poster_path
                    },
                    theatre_id:theatredata?.name
                }
            }
            notificationWithMovieImage = {
                ...notification,
                orderdata: notification?.orderdata ? updatedOrderData : notification?.orderdata,
                moviedata: notification?.moviedata ? updatedMovieData : notification?.moviedata
            }
            if(notification.type === "SHOW_ALERT" || notification?.type === "MOVIE_REMINDER"){
                sendUserNotification(notificationWithMovieImage,notificationWithMovieImage.reciever_id.toString())
            }else{
                sendTheatreNotification(notificationWithMovieImage,notificationWithMovieImage.reciever_id.toString())
            }
            return true
        } catch (err) {
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }

}
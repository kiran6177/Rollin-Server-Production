import { AwsConfig } from "../../utils/aws-s3.js";
const MOVIE_OWNER = 'movie';

export class TheatreNotificationsGet{
    constructor(dependencies){
        this.notificationRepository = new dependencies.Repositories.MongoNotificationRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({page},{id}){
        try {
            console.log("NOTI",page,id);
            const pageFrom = page || 1;
            const LIMIT = 10;
            const skip = (pageFrom - 1) * LIMIT;
            const notificationsList = await this.notificationRepository.getNotificationsByRecieverWithPage(id,skip,LIMIT)
            const notificationWithMovieImage = [];
            for(let notificationObj of notificationsList){
                let notification = notificationObj.toObject()
                let updatedMovieData = {}
                if(notification?.moviedata){
                    const backdrop_path = await this.awsConfig.getImage(notification?.moviedata?.backdrop_path,MOVIE_OWNER)
                    const poster_path = await this.awsConfig.getImage(notification?.moviedata?.poster_path,MOVIE_OWNER)  
                    updatedMovieData = {
                        ...notification.moviedata,
                        backdrop_path,
                        poster_path
                    }                  
                }
                
                notificationWithMovieImage.push({
                    ...notification,
                    moviedata: notification?.moviedata ? updatedMovieData : notification?.moviedata
                })
            }
            return notificationWithMovieImage
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
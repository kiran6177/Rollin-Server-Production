export class TheatreSingleShowGet{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.userRepository = new dependencies.Repositories.MongoUserRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.reservationRepository = new dependencies.Repositories.MongoReservationRepository()
    }

    async execute({date,show_id}){
        try {
            console.log(date,show_id);
            if(date && show_id){
                const showData = await this.reservationRepository.getSingleShowDataByIdandDate(show_id,date);
                console.log("showOut",showData);
                const show = showData[0]
                    let updatedShow;
                    show.shows[0]?.screenData[0]?.running_movies.map(movie=>{
                        if(show._id.toString() == movie?.movie_id){
                            updatedShow = {
                                ...show,
                                movie
                            }
                        }
                    })
                    let tiers = []
                    show.shows[0]?.screenData[0]?.tiers.map(tier=>{
                        let identifiers = []
                        tier?.layout.map(layoutObj=>{
                            identifiers.push(Object.keys(layoutObj)[0])
                        })
                        tiers.push({
                            name:tier.name,
                            rate:tier.rate,
                            identifiers:identifiers.sort((a,b)=>b-a)
                        })
                    })
                    const reservationsWithUser = []
                    for(let reserveObj of show.shows[0].reservations){
                        const key = Object.keys(reserveObj)[0]
                        const values = Object.values(reserveObj)[0]
                        const valuesWithUser = []
                        for(let seatObj of values){
                            if(seatObj?.user_id && seatObj?.user_id !== 'BY_THEATRE'){
                                const userData = await this.userRepository.findUserById(seatObj?.user_id)
                                valuesWithUser.push({
                                    ...seatObj,
                                    user_id:{
                                        id: seatObj?.user_id,
                                        name:userData?.firstname + " " + userData?.lastname
                                    }
                                })
                            }else{
                                valuesWithUser.push(seatObj)
                            }
                        }
                        reservationsWithUser.push({
                            [key] : valuesWithUser
                        })
                    }
                    updatedShow = {
                        ...updatedShow,
                        shows:[{
                            ...updatedShow.shows[0],
                            reservations:reservationsWithUser
                        }],
                        tiers,
                        sound:show.shows[0]?.screenData[0]?.sound_setup
                    }
                    console.log("Up",updatedShow);
                    return updatedShow
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
import { getMonthRange, getSevenDayRange, getWeekRange, getYearRange } from "../../utils/getRange.js";
let acceptedDateFrames = ['DAILY','WEEKLY','MONTHLY','YEARLY']

class GetTheatresAndUsers{
    constructor(dependencies){
        this.userRepository = new dependencies.Repositories.MongoUserRepository();
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository();
    }

    async getTheatresAndUsers(type,dateRanges){
        try {
            console.log(type,dateRanges);
            let dates = []
            let theatreData = [];
            let userData = [];
            for(let {startDate,endDate} of dateRanges){
                const theatresCount = await this.theatreRepository.getTheatresCountByDate(startDate,endDate)
                const usersCount = await this.userRepository.getUsersCountByDate(startDate,endDate)
                if(type === "DAILY"){
                    dates.push(endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'}))
                }else if(type === "WEEKLY"){
                    let startDateString = startDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                    let endDateString = endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'})
                    dates.push(startDateString+ ' - ' + endDateString) ;
                }else if(type === "MONTHLY"){
                    dates.push(startDate.toLocaleDateString('en-US',{month:'long'}))
                }else if(type === 'YEARLY'){   
                    dates.push(endDate.toLocaleDateString('en-US',{year:'numeric'}))
                }
                theatreData.push(theatresCount[0]?.totalCount || 0)
                userData.push(usersCount[0]?.totalCount || 0)
                if(type === 'YEARLY'){   
                    dates.push(2023)
                    theatreData.push(0)
                    userData.push(0)  
                }
            }
            console.log(dates);
            console.log(theatreData);
            console.log(userData);
            return{
                dates,
                users:userData,
                theatres:theatreData
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

export class AdminRegistrationDetailsGet{
    constructor(dependencies){
        this.adminRepository = new dependencies.Repositories.MongoAdminRepository();
        this.getTheatresAndUsersUseCase = new GetTheatresAndUsers(dependencies)
    }

    async execute({dateFrame}){
        try {
            if(!dateFrame || !acceptedDateFrames.includes(dateFrame)){
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid DateRange!!'];
                throw error;  
            }
            let resultData = {}
            let now = new Date()
            switch (dateFrame){
                case "DAILY":
                    const dailyRange = await getSevenDayRange(now)
                    const getDailyData = await this.getTheatresAndUsersUseCase.getTheatresAndUsers("DAILY",dailyRange)
                    resultData = getDailyData
                    break;
                case "WEEKLY":
                    const weekRange = await getWeekRange(now)
                    const getWeeklyData = await this.getTheatresAndUsersUseCase.getTheatresAndUsers("WEEKLY",weekRange)
                    resultData = getWeeklyData
                    break;
                case "MONTHLY":
                    const monthRange = await getMonthRange(now);
                    const getMonthlyData = await this.getTheatresAndUsersUseCase.getTheatresAndUsers("MONTHLY",monthRange)
                    resultData = getMonthlyData
                    break;
                case "YEARLY":
                    const yearRange = await getYearRange(now)
                    const getYearlyData = await this.getTheatresAndUsersUseCase.getTheatresAndUsers("YEARLY",yearRange)
                    resultData = getYearlyData
                    break;    
            }
            return resultData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
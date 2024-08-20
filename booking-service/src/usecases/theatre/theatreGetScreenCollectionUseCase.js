import { getMonthRange, getSevenDayRange, getWeekRange, getYearRange } from "../../utils/getRange.js";

export class TheatreScreenCollectionGet{
    constructor(dependencies){
        this.getCollectionsHelper = new dependencies.UseCase.GetCollections(dependencies)
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
    }

    async execute({dataFrame},{id}){
        try {
            if(dataFrame && id){
                let now = new Date()
                let screenData = await this.theatreRepository.findTheatreById(id)
                const screens = screenData?.screens || [];
                let resultData = [];
                switch (dataFrame){
                    case "DAILY":
                        const dailyRange = await getSevenDayRange(now)
                        resultData = await this.getCollectionsHelper.getCollections("DAILY",dailyRange,screens)

                        break;
                    case "WEEKLY":
                        const weekRange = await getWeekRange(now)
                        resultData = await this.getCollectionsHelper.getCollections("WEEKLY",weekRange,screens)
                        break;
                    case "MONTHLY":
                        const monthRange = await getMonthRange(now);
                        resultData = await this.getCollectionsHelper.getCollections("MONTHLY",monthRange,screens)
                        break;
                    case "YEARLY":
                        const yearRange = await getYearRange(now)
                        resultData = await this.getCollectionsHelper.getCollections("YEARLY",yearRange,screens)
                        break;    
                }
                console.log(resultData);
                return resultData
            }else{
                const error = new Error()
                error.statusCode = 400;
                error.reasons = ['Invalid Inputs!!'];
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
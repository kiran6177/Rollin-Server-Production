import { getHtmlContent } from "../../utils/getHtml.js";
import { getRangeDays } from "../../utils/getRange.js";
import { generatePdf } from 'html-pdf-node';

export class TheatreReportCollection{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.screenRepository = new dependencies.Repositories.MongoScreenRepository()
        this.orderRepository = new dependencies.Repositories.MongoOrderRepository()
        this.getCollectionsHelper = new dependencies.UseCase.GetCollections(dependencies)
    }

    async execute({startDate,endDate},{id}){
        try {
            console.log(startDate,endDate,id);
            const dateRanges = await getRangeDays(startDate,endDate)
            let theatreData = await this.theatreRepository.findTheatreById(id)
            const screens = theatreData?.screens || [];
            let resultData = [];
            resultData = await this.getCollectionsHelper.getCollections("RANGE",dateRanges,screens)
            const htmlContent = await getHtmlContent(resultData,theatreData?.name);

            let options = { format : 'A4' };
            let file = { content : htmlContent };

            const pdfBuffer = await generatePdf(file,options);
            return pdfBuffer
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
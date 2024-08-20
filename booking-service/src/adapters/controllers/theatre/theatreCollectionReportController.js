import { AwsConfig } from "../../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre';

export class TheatreCollectionReport{
    constructor(dependencies){
        this.theatreCollectionReportUseCase = new dependencies.UseCase.TheatreReportCollection(dependencies)
        this.awsConfig = new AwsConfig()
    }

    async generateReport(req,res,next){
        try {
            const resultData = await this.theatreCollectionReportUseCase.execute(req.body,req?.theatre);
            
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=report.pdf',
                'Content-Length': resultData.length
            });

            res.status(200).send(resultData)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}
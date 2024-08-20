export class TheatreProfileComplete{
    constructor(dependencies){
        this.completeProfileUseCase = new dependencies.UseCase.CompleteProfile(dependencies)
    }

    async completeProfile(req,res,next){
        try {
            // console.log(req.body);
            // console.log(req.files);
            const { formdata } = req.body;
            const data = JSON.parse(formdata);
            const result = await this.completeProfileUseCase.execute(data,req.files)
            console.log(result);
            if(!result.isVerified){
                // res.cookie('theatreRefreshToken',null,{httpOnly:true,secure:true,maxAge:0})
               return res.status(201).json({success:true});
            }
            // res.status(200).json({theatreData:result});
        } catch (error) {
            next(error)
        }
    }

}
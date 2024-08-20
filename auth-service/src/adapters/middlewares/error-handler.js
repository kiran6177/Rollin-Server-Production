export class ErrorHandler{
    static handleError(err,req,res,next){
        console.log('errorhandler',err);
        res.status(err.statusCode ? err.statusCode : 500).json({error:{reasons:err.reasons ? err.reasons :[ 'Some error occured!!']} || 'Internal Server Error!!'})
    }
}
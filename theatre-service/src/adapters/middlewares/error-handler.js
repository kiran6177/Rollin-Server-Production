export class ErrorHandler{
    static handleError(err,req,res,next){
        console.log('errorhandler',err);
        res.status(err.statusCode ? err.statusCode : 500).json({error:{reasons:err.reasons} || 'Internal Server Error!!'})
    }
}
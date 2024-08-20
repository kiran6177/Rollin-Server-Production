export class TheatreLogout{

    async logout(req,res,next){
        try {
            console.log(req.cookies.theatreRefreshToken);
            res.cookie('theatreRefreshToken',null,{httpOnly:true,secure:true,maxAge:0})
            res.status(200).json({message:'Logout Successfully.'})
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}
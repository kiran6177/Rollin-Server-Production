export class UserLogout{
    constructor(dependencies){
    }
    async logoutUser(req,res,next){
        try {
            console.log(req.cookies.refreshToken);
            res.cookie('refreshToken',null,{httpOnly:true,secure:true,maxAge:0})
            const dataToFrontend = {
                message:'Logout Successfully.'
            }
            // if(req?.newUserToken !== null){
            //     dataToFrontend.newUserToken = req.newUserToken;
            //     dataToFrontend.newUserData = req.user;
            // }
            res.status(200).json(dataToFrontend)
        } catch (err) {
            console.log(err.message);
            const error = new Error()
            error.statusCode = 500;
            error.reasons = [err.message];
            next(error)
        }
    }
}
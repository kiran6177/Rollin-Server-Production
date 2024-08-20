import express from "express";
import dependencies from "../../../frameworks/dependencies.js";
import { AuthHandler } from "../../middlewares/auth-handler.js";
import { TheatreLoginController, TheatreLogoutContrller, TheatreSignupController ,
    TheatreProfileCompleteController, TheatreOtpVerifyController, TheatreResendOtpController,
     TheatreUpdateProfileController, 
     TheatreGetNotificationsController} from "../../controllers/index.js";
import upload from "../../../utils/multer.js";  
import { OtpValidator } from "../../middlewares/otp-expire-handler.js";
const theatreRouter = express.Router();

const controllers = {
    theatreSignupController : new TheatreSignupController(dependencies),
    theatreLogoutController : new TheatreLogoutContrller(dependencies),
    theatreLoginController : new TheatreLoginController(dependencies),
    theatreProfileCompleteController : new TheatreProfileCompleteController(dependencies),
    theatreOtpVerifyController : new TheatreOtpVerifyController(dependencies),
    theatreResendOtpController : new TheatreResendOtpController(dependencies),
    theatreUpdateProfileController : new TheatreUpdateProfileController(dependencies),
    theatreGetNotificationsController : new TheatreGetNotificationsController(dependencies)
}

theatreRouter.post('/login/:type',async(req,res,next)=>{controllers.theatreLoginController.login(req,res,next)});
theatreRouter.post('/signup',async(req,res,next)=>{controllers.theatreSignupController.signup(req,res,next)});

theatreRouter.post('/completeprofile',upload.array('images',6),(req,res,next)=>{controllers.theatreProfileCompleteController.completeProfile(req,res,next)});
theatreRouter.post('/verifyotp/:type',OtpValidator.validateTheatreOtp,async(req,res,next)=>{controllers.theatreOtpVerifyController.verifyTheatre(req,res,next)})
theatreRouter.post('/resendotp',async (req,res,next)=>{controllers.theatreResendOtpController.resendOtp(req,res,next)})
theatreRouter.put('/updateprofile',AuthHandler.isTheatreLogin, upload.array('images',6),async(req,res,next)=>{controllers.theatreUpdateProfileController.updateProfile(req,res,next)})

theatreRouter.get('/logout',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreLogoutController.logout(req,res,next)})
theatreRouter.post('/getnotifications',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetNotificationsController.getNotifications(req,res,next)});

export default theatreRouter;
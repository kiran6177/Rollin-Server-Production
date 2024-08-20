import express from "express";
import {
  UserAuthController,
  UserEditEmailController,
  UserEditProfileController,
  UserGetNotificationsController,
  UserLogoutController,
  UserResendOtpController,
  UserResendProfileOtpController,
  UserVerifyOtpController,
  UserVerifyProfileOtpController,
} from "../../controllers/index.js";
import dependencies from "../../../frameworks/dependencies.js";
import { AuthHandler } from "../../middlewares/auth-handler.js";
import upload from "../../../utils/multer.js";
import { OtpValidator } from "../../middlewares/otp-expire-handler.js";
const userRouter = express.Router();

const controllers = {
  userAuthController: new UserAuthController(dependencies),
  useLogoutController: new UserLogoutController(dependencies),
  userVerifyOtpController: new UserVerifyOtpController(dependencies),
  userResendOtpController: new UserResendOtpController(dependencies),
  userEditProfileController: new UserEditProfileController(dependencies),
  userVerifyProfileOtpController: new UserVerifyProfileOtpController(
    dependencies
  ),
  userEditEmailController: new UserEditEmailController(dependencies),
  userResendProfileOtpController: new UserResendProfileOtpController(
    dependencies
  ),
  userGetNotificationsController: new UserGetNotificationsController(
    dependencies
  ),
};


userRouter.post("/login/:type", (req, res, next) =>
  controllers.userAuthController.authenticateUser(req, res, next)
);


userRouter.post(
  "/verifyotp/:type",
  OtpValidator.validateUserOtp,
  (req, res, next) => {
    controllers.userVerifyOtpController.verifyUser(req, res, next);
  }
);


userRouter.post("/resendotp", (req, res, next) => {
  controllers.userResendOtpController.resendOtp(req, res, next);
});


userRouter.get("/logout", AuthHandler.isUserLogin, (req, res, next) =>
  controllers.useLogoutController.logoutUser(req, res, next)
);


userRouter.post(
  "/editprofile",
  AuthHandler.isUserLogin,
  upload.single("image"),
  (req, res, next) => {
    controllers.userEditProfileController.editProfile(req, res, next);
  }
);


userRouter.post("/editemail", AuthHandler.isUserLogin, (req, res, next) => {
  controllers.userEditEmailController.editEmail(req, res, next);
});


userRouter.post(
  "/verifyotpprofile",
  AuthHandler.isUserLogin,
  OtpValidator.validateUserOtp,
  (req, res, next) => {
    controllers.userVerifyProfileOtpController.verifyProfileOtp(req, res, next);
  }
);


userRouter.post(
  "/resendprofileotp",
  AuthHandler.isUserLogin,
  (req, res, next) => {
    controllers.userResendProfileOtpController.resendProfileOtp(req, res, next);
  }
);


userRouter.post(
  "/getnotifications",
  AuthHandler.isUserLogin,
  (req, res, next) => {
    controllers.userGetNotificationsController.getNotifications(req, res, next);
  }
);

export default userRouter;

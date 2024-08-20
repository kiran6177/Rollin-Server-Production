import { AdminLogin } from "./admin/adminLoginController.js";
import { AdminLogout } from "./admin/adminLogoutController.js";
import { AdminGetUsers } from "./admin/adminGetUsersController.js";
import { AdminUserBlockUnblock } from "./admin/adminBlockUnBlockController.js";
import { AdminGetTheatres } from "./admin/adminGetTheatresController.js";
import { AdminTheatreBlockUnblock } from "./admin/adminBlockUnblockTheatre.js";
import { AdminTheatreApprove } from "./admin/adminApproveTheatreController.js";
import { AdminGetRegistrationDetails } from "./admin/adminGetRegistrationDetailsController.js";

import { TheatreSignup } from "./theatre/theatreSignupController.js";
import { TheatreLogout } from "./theatre/theatreLogoutController.js";
import { TheatreLogin } from "./theatre/theatreLoginController.js";
import { TheatreProfileComplete } from "./theatre/theatreCompleteProfileController.js";
import { TheatreOtpVerify } from "./theatre/theatreOtpVerifyController.js";
import { TheatreResend } from "./theatre/theatreResendOtpController.js";
import { TheatreUpdateProfile } from "./theatre/theatreUpdateProfileController.js";
import { TheatreGetNotifications } from "./theatre/theatreGetNotificationsController.js";

import { UserAuth  } from "./user/userAuthController.js";
import { UserLogout } from "./user/logoutController.js";
import { UserVerifyOtp } from "./user/userVerifyOtpController.js";
import { UserResendOtp } from "./user/userResendOtpController.js";
import { UserEditProfile } from "./user/userEditProfileController.js";
import { UserVerifyProfileOtp } from "./user/userVerifyProfileOtpController.js";
import { UserEditEmail } from "./user/userEditEmailController.js";
import { UserResendProfileOtp } from "./user/userResendProfileOtpController.js";
import { UserGetNotifications } from "./user/getNotificationsController.js";
import { UserGetUnread } from "./user/getUnreadController.js";

import { CreateNotification } from "./consumeControllers/createNotificationController.js";

export {
    UserAuth as  UserAuthController,
    UserLogout as UserLogoutController,
    AdminLogin as AdminLoginController,
    AdminLogout as AdminLogoutController,
    TheatreSignup as TheatreSignupController,
    TheatreLogout as TheatreLogoutContrller,
    TheatreLogin as TheatreLoginController,
    TheatreProfileComplete as TheatreProfileCompleteController,
    TheatreOtpVerify as TheatreOtpVerifyController,
    TheatreResend as TheatreResendOtpController,
    UserVerifyOtp as UserVerifyOtpController,
    AdminGetUsers as AdminGetUsersController,
    AdminUserBlockUnblock as AdminUserBlockUnblockController,
    AdminGetTheatres as AdminGetTheatresController,
    AdminTheatreBlockUnblock as AdminTheatreBlockUnblockController,
    AdminTheatreApprove as AdminTheatreApproveController,
    TheatreUpdateProfile as TheatreUpdateProfileController,
    UserResendOtp as UserResendOtpController,
    UserEditProfile as UserEditProfileController,
    UserVerifyProfileOtp as UserVerifyProfileOtpController,
    UserEditEmail as UserEditEmailController,
    UserResendProfileOtp as UserResendProfileOtpController,
    CreateNotification as CreateNotificationController,
    UserGetNotifications as UserGetNotificationsController,
    UserGetUnread as UserGetUnreadController,
    TheatreGetNotifications as TheatreGetNotificationsController,
    AdminGetRegistrationDetails as AdminGetRegistrationDetailsController
}
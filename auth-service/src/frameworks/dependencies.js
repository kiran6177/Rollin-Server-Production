import {
  MongoAdminRepository,
  MongoNotificationRepository,
  MongoTheatreRepository,
  MongoUserRepository,
} from "../adapters/repositories/index.js";

import {
  GoogleUserAuth,
  AdminLogin,
  TheatreSignup,
  TheatreLogin,
  CompleteProfile,
  TheatreGoogleAuth,
  VerifyTheatre,
  TheatreResendOTP,
  EmailUserAuth,
  VerifyUserOtp,
  GetUsers,
  UserBlockUnblock,
  GetTheatres,
  TheatreBlockUnblock,
  TheatreApprove,
  TheatreProfileUpdate,
  ResendOtpUser,
  UserProfileEdit,
  VerifyProfileOtp,
  UserEmailEdit,
  ResendProfileOtpUser,
  NotificationCreate,
  UserNotificationGet,
  UnreadGet,
  TheatreNotificationsGet,
  AdminRegistrationDetailsGet,
} from "../usecases/index.js";

const ConsumeUseCase = {
  NotificationCreate,
};

const UseCase = {
  GoogleUserAuth,
  AdminLogin,
  TheatreSignup,
  TheatreLogin,
  CompleteProfile,
  TheatreGoogleAuth,
  VerifyTheatre,
  TheatreResendOTP,
  EmailUserAuth,
  VerifyUserOtp,
  GetUsers,
  UserBlockUnblock,
  GetTheatres,
  TheatreBlockUnblock,
  TheatreApprove,
  TheatreProfileUpdate,
  ResendOtpUser,
  UserProfileEdit,
  UserEmailEdit,
  VerifyProfileOtp,
  ResendProfileOtpUser,
  UserNotificationGet,
  UnreadGet,
  TheatreNotificationsGet,
  AdminRegistrationDetailsGet
};

const Repositories = {
  MongoUserRepository,
  MongoAdminRepository,
  MongoTheatreRepository,
  MongoNotificationRepository,
};

const dependencies = {
  UseCase,
  Repositories,
  ConsumeUseCase,
};

export default dependencies;

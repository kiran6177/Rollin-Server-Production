import {
  createToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import {
  MongoAdminRepository,
  MongoTheatreRepository,
  MongoUserRepository,
} from "../repositories/index.js";

export class AuthHandler {
  static async isUserLogin(req, res, next) {
    try {
      const userRepository = new MongoUserRepository();
      if (req.headers && req.headers["authorization"]) {
        const access_token = req.headers["authorization"].split(" ")[1];
        const decoded = await verifyAccessToken(access_token);
        console.log(decoded);
        if (decoded) {
          if (decoded.role === "USER") {
            const isValid = await userRepository.findUserById(decoded.id);
            if (isValid?.isVerified) {
              req.user = decoded;
              console.log("decIN", req.user);
              next();
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["You are temporarily blocked by admin!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized User!!"];
            throw error;
          }
        } else {
          if (req.cookies && req.cookies["refreshToken"]) {
            const refreshToken = req.cookies["refreshToken"];
            if (refreshToken) {
              const decoded = await verifyRefreshToken(refreshToken);
              console.log("REfresh", decoded);
              if (decoded) {
                if (decoded.role === "USER") {
                  const isAllowed = await userRepository.findUserById(
                    decoded.id
                  );
                  console.log(isAllowed);
                  if (isAllowed) {
                    if (!isAllowed.isVerified) {
                      const error = new Error();
                      error.statusCode = 403;
                      error.reasons = [
                        "You are temporarily blocked by admin!!",
                      ];
                      throw error;
                    } else {
                      const userWOP = {
                        id: isAllowed.id,
                        email: isAllowed.email,
                        mobile: isAllowed.mobile,
                        firstname: isAllowed.firstname,
                        lastname: isAllowed.lastname,
                        image: isAllowed.image,
                        address: isAllowed.address,
                        walletBalance: isAllowed.walletBalance,
                        isVerified: isAllowed.isVerified,
                      };
                      const newAccessToken = await createToken({
                        ...userWOP,
                        role: "USER",
                      });
                      req.newUserToken = newAccessToken;
                      req.user = userWOP;
                      next();
                    }
                  } else {
                    const error = new Error();
                    error.statusCode = 403;
                    error.reasons = ["Invalid Refresh!!"];
                    throw error;
                  }
                } else {
                  const error = new Error();
                  error.statusCode = 403;
                  error.reasons = ["UnAuthorized User!!"];
                  throw error;
                }
              } else {
                const error = new Error();
                error.statusCode = 403;
                error.reasons = ["Invalid Refresh!!"];
                throw error;
              }
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["Invalid Token!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized User!!"];
            throw error;
          }
        }
      } else {
        console.log(req.cookies);
        if (req.cookies && req.cookies["refreshToken"]) {
          const refreshToken = req.cookies["refreshToken"];
          if (refreshToken) {
            const decoded = await verifyRefreshToken(refreshToken);
            console.log("REfresh", decoded);
            if (decoded) {
              if (decoded.role === "USER") {
                const isAllowed = await userRepository.findUserById(decoded.id);
                console.log(isAllowed);
                if (isAllowed) {
                  if (!isAllowed.isVerified) {
                    const error = new Error();
                    error.statusCode = 403;
                    error.reasons = ["You are temporarily blocked by admin!!"];
                    throw error;
                  } else {
                    const userWOP = {
                      id: isAllowed.id,
                      email: isAllowed.email,
                      mobile: isAllowed.mobile,
                      firstname: isAllowed.firstname,
                      lastname: isAllowed.lastname,
                      image: isAllowed.image,
                      address: isAllowed.address,
                      walletBalance: isAllowed.walletBalance,
                      isVerified: isAllowed.isVerified,
                    };
                    const newAccessToken = await createToken({
                      ...userWOP,
                      role: "USER",
                    });
                    req.newUserToken = newAccessToken;
                    req.user = userWOP;
                    next();
                  }
                } else {
                  const error = new Error();
                  error.statusCode = 403;
                  error.reasons = ["Invalid Refresh!!"];
                  throw error;
                }
              } else {
                const error = new Error();
                error.statusCode = 403;
                error.reasons = ["UnAuthorized User!!"];
                throw error;
              }
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["Invalid Refresh!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["Invalid Token!!"];
            throw error;
          }
        } else {
          const error = new Error();
          error.statusCode = 403;
          error.reasons = ["UnAuthorized User!!"];
          throw error;
        }
      }
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  }
  static async isAdminLogin(req, res, next) {
    try {
      const adminRepository = new MongoAdminRepository();
      if (req.headers && req.headers["authorization"]) {
        const access_token = req.headers["authorization"].split(" ")[1];
        const decoded = await verifyAccessToken(access_token);
        console.log(decoded);
        if (decoded) {
          if (decoded.role === "ADMIN") {
            req.admin = decoded;
            console.log("decINAdmin", req.admin);
            next();
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized Admin!!"];
            throw error;
          }
        } else {
          if (req.cookies && req.cookies["adminRefreshToken"]) {
            const adminRefreshToken = req.cookies["adminRefreshToken"];
            if (adminRefreshToken) {
              const decoded = await verifyRefreshToken(adminRefreshToken);
              console.log("REfresh", decoded);
              if (decoded) {
                if (decoded.role === "ADMIN") {
                  const isAllowed = await adminRepository.findAdminById(
                    decoded.id
                  );
                  console.log(isAllowed);
                  if (isAllowed) {
                    const adminWOP = {
                      id: isAllowed._id,
                      name: isAllowed.name,
                      email: isAllowed.email,
                      mobile: isAllowed.mobile,
                    };
                    const newAccessToken = await createToken({
                      ...adminWOP,
                      role: "ADMIN",
                    });
                    req.newAdminToken = newAccessToken;
                    req.admin = adminWOP;
                    next();
                  } else {
                    const error = new Error();
                    error.statusCode = 403;
                    error.reasons = ["UnAuthorized Admin!!"];
                    throw error;
                  }
                } else {
                  const error = new Error();
                  error.statusCode = 403;
                  error.reasons = ["UnAuthorized Admin!!"];
                  throw error;
                }
              } else {
                const error = new Error();
                error.statusCode = 403;
                error.reasons = ["UnAuthorized Admin!!"];
                throw error;
              }
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["UnAuthorized Admin!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized Admin!!"];
            throw error;
          }
        }
      } else {
        if (req.cookies && req.cookies["adminRefreshToken"]) {
          const adminRefreshToken = req.cookies["adminRefreshToken"];
          if (adminRefreshToken) {
            const decoded = await verifyRefreshToken(adminRefreshToken);
            console.log("REfresh", decoded);
            if (decoded) {
              if (decoded.role === "ADMIN") {
                const isAllowed = await adminRepository.findAdminById(
                  decoded.id
                );
                console.log(isAllowed);
                if (isAllowed) {
                  const adminWOP = {
                    id: adminExist._id,
                    name: adminExist.name,
                    email: adminExist.email,
                    mobile: adminExist.mobile,
                  };
                  const newAccessToken = await createToken({
                    ...adminWOP,
                    role: "ADMIN",
                  });
                  req.newAdminToken = newAccessToken;
                  req.admin = adminWOP;
                  next();
                } else {
                  const error = new Error();
                  error.statusCode = 403;
                  error.reasons = ["UnAuthorized Admin!!"];
                  throw error;
                }
              } else {
                const error = new Error();
                error.statusCode = 403;
                error.reasons = ["UnAuthorized Admin!!"];
                throw error;
              }
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["UnAuthorized Admin!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized Admin!!"];
            throw error;
          }
        } else {
          const error = new Error();
          error.statusCode = 403;
          error.reasons = ["UnAuthorized Admin!!"];
          throw error;
        }
      }
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  }
  static async isTheatreLogin(req, res, next) {
    try {
      const theatreRepository = new MongoTheatreRepository();
      if (req.headers && req.headers["authorization"]) {
        const access_token = req.headers["authorization"].split(" ")[1];
        const decoded = await verifyAccessToken(access_token);
        if (decoded) {
          if (decoded.role === "THEATRE") {
            const isValid = await theatreRepository.findTheatreById(decoded.id);
            if (isValid?.isBlocked || !isValid?.isVerified) {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["You are temporarily blocked by admin!!"];
              throw error;
            } else {
              req.theatre = decoded;
              console.log("decInTheatre", req.theatre);
              next();
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized Theatre!!"];
            throw error;
          }
        } else {
          if (req.cookies && req.cookies["theatreRefreshToken"]) {
            const theatreRefreshToken = req.cookies["theatreRefreshToken"];
            if (theatreRefreshToken) {
              const decoded = await verifyRefreshToken(theatreRefreshToken);
              console.log("REfresh", decoded);
              if (decoded) {
                if (decoded.role === "THEATRE") {
                  const isAllowed = await theatreRepository.findTheatreById(
                    decoded.id
                  );
                  console.log(isAllowed);
                  if (isAllowed) {
                    if (isAllowed.isBlocked || !isAllowed.isVerified) {
                      const error = new Error();
                      error.statusCode = 403;
                      error.reasons = [
                        "You are temporarily blocked by admin!!",
                      ];
                      throw error;
                    } else {
                      const theatreWOP = {
                        id: isAllowed._id,
                        name: isAllowed.name,
                        email: isAllowed.email,
                        images: isAllowed.images,
                        address: isAllowed.address,
                        location: isAllowed.location,
                        isCompleted: isAllowed.isCompleted,
                        isAccepted: isAllowed.isAccepted,
                        isVerified: isAllowed.isVerified,
                        isBlocked: isAllowed.isBlocked,
                      };
                      const newAccessToken = await createToken({
                        ...theatreWOP,
                        role: "THEATRE",
                      });
                      req.newTheatreToken = newAccessToken;
                      req.theatre = theatreWOP;
                      next();
                    }
                  } else {
                    const error = new Error();
                    error.statusCode = 403;
                    error.reasons = ["UnAuthorized Theatre!!"];
                    throw error;
                  }
                } else {
                  const error = new Error();
                  error.statusCode = 403;
                  error.reasons = ["UnAuthorized Theatre!!"];
                  throw error;
                }
              } else {
                const error = new Error();
                error.statusCode = 403;
                error.reasons = ["UnAuthorized Theatre!!"];
                throw error;
              }
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["UnAuthorized Theatre!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized Theatre!!"];
            throw error;
          }
        }
      } else {
        if (req.cookies && req.cookies["theatreRefreshToken"]) {
          const theatreRefreshToken = req.cookies["theatreRefreshToken"];
          if (theatreRefreshToken) {
            const decoded = await verifyRefreshToken(theatreRefreshToken);
            console.log("REfresh", decoded);
            if (decoded) {
              if (decoded.role === "THEATRE") {
                const isAllowed = await theatreRepository.findTheatreById(
                  decoded.id
                );
                console.log(isAllowed);
                if (isAllowed) {
                  if (isAllowed.isBlocked || !isAllowed.isVerified) {
                    const error = new Error();
                    error.statusCode = 403;
                    error.reasons = ["You are temporarily blocked by admin!!"];
                    throw error;
                  } else {
                    const theatreWOP = {
                      id: isAllowed._id,
                      name: isAllowed.name,
                      email: isAllowed.email,
                      images: isAllowed.images,
                      address: isAllowed.address,
                      location: isAllowed.location,
                      isCompleted: isAllowed.isCompleted,
                      isAccepted: isAllowed.isAccepted,
                      isVerified: isAllowed.isVerified,
                      isBlocked: isAllowed.isBlocked,
                    };
                    const newAccessToken = await createToken({
                      ...theatreWOP,
                      role: "THEATRE",
                    });
                    req.newTheatreToken = newAccessToken;
                    req.theatre = theatreWOP;
                    next();
                  }
                } else {
                  const error = new Error();
                  error.statusCode = 403;
                  error.reasons = ["UnAuthorized Theatre!!"];
                  throw error;
                }
              } else {
                const error = new Error();
                error.statusCode = 403;
                error.reasons = ["UnAuthorized Theatre!!"];
                throw error;
              }
            } else {
              const error = new Error();
              error.statusCode = 403;
              error.reasons = ["UnAuthorized Theatre!!"];
              throw error;
            }
          } else {
            const error = new Error();
            error.statusCode = 403;
            error.reasons = ["UnAuthorized Theatre!!"];
            throw error;
          }
        } else {
          const error = new Error();
          error.statusCode = 403;
          error.reasons = ["UnAuthorized Theatre!!"];
          throw error;
        }
      }
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  }
}

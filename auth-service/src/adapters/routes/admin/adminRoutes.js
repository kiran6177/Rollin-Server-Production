import express from "express";
import dependencies from "../../../frameworks/dependencies.js";
import { AuthHandler } from "../../middlewares/auth-handler.js";
import { AdminGetRegistrationDetailsController, AdminGetTheatresController, AdminGetUsersController, AdminLoginController , AdminLogoutController, AdminTheatreApproveController, AdminTheatreBlockUnblockController, AdminUserBlockUnblockController } from "../../controllers/index.js";
const adminRouter = express.Router();

const controllers = {
    adminLoginController : new AdminLoginController(dependencies),
    adminLogoutController : new AdminLogoutController(dependencies),
    adminGetUsersController : new AdminGetUsersController(dependencies),
    adminUserBlockUnblockController : new AdminUserBlockUnblockController(dependencies),
    adminGetTheatresController : new AdminGetTheatresController(dependencies),
    adminTheatreBlockUnblockController : new AdminTheatreBlockUnblockController(dependencies),
    adminTheatreApproveController : new AdminTheatreApproveController(dependencies),
    adminGetRegistrationDetailsController : new AdminGetRegistrationDetailsController(dependencies)
}

adminRouter.post('/login',async(req,res,next)=>{controllers.adminLoginController.loginAdmin(req,res,next)});
adminRouter.get('/logout',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminLogoutController.logoutAdmin(req,res,next)})
adminRouter.get('/getusers',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetUsersController.getUsers(req,res,next)})
adminRouter.get('/gettheatres',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetTheatresController.getTheatres(req,res,next)})
adminRouter.post('/blockunblockuser',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminUserBlockUnblockController.blockUnblock(req,res,next)})
adminRouter.post('/blockunblocktheatre',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminTheatreBlockUnblockController.blockUnblock(req,res,next)})
adminRouter.post('/approvetheatre',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminTheatreApproveController.approve(req,res,next)})
adminRouter.post('/getregistrationdetails',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetRegistrationDetailsController.getRegistrationDetails(req,res,next)})


export default adminRouter;
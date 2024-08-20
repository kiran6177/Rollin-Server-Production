import express from 'express';
import { AuthHandler } from '../middlewares/auth-handler.js'
const bookingRouter = express.Router();
import dependencies from '../../frameworks/dependencies.js';
import { AdminGetHighGrossMoviesController, TheatreBookSeatController, TheatreCollectionReportController, TheatreGetCompleteOrdersController, TheatreGetLatestOrdersController, TheatreGetMovieCollectionController, TheatreGetScreenBookingsController, TheatreGetScreenCollectionController, TheatreGetShowBookingController, TheatreGetSingleShowController, TheatreShowCancellationController, UserCancelTicketController, UserGetOrdersController, UserGetRecommendedMoviesController, UserGetShowByMovieController, UserGetShowDataController, UserGetSingleShowDataController, UserGetUpcomingMoviesController, UserPaymentInitiateController, UserPaymentProcessController, UserSeatReservationController } from '../controllers/index.js';

const controllers = {
    theatreGetShowBookingController : new TheatreGetShowBookingController(dependencies),
    theatreShowCancellationController : new TheatreShowCancellationController(dependencies),
    userGetShowDataController : new UserGetShowDataController(dependencies),
    userGetSingleShowDataController : new UserGetSingleShowDataController(dependencies),
    userGetShowByMovieController : new UserGetShowByMovieController(dependencies),
    userSeatReservationController : new UserSeatReservationController(dependencies),
    userPaymentInitiateController : new UserPaymentInitiateController(dependencies),
    userPaymentProcessController : new UserPaymentProcessController(dependencies),
    userGetOrdersController : new UserGetOrdersController(dependencies),
    theatreGetScreenBookingsController : new TheatreGetScreenBookingsController(dependencies),
    theatreGetSingleShowController : new TheatreGetSingleShowController(dependencies),
    theatreGetCompleteOrdersController : new TheatreGetCompleteOrdersController(dependencies),
    theatreBookSeatController : new TheatreBookSeatController(dependencies),
    userGetUpcomingMoviesController : new UserGetUpcomingMoviesController(dependencies),
    userGetRecommendedMoviesController : new UserGetRecommendedMoviesController(dependencies),
    theatreGetScreenCollectionController : new TheatreGetScreenCollectionController(dependencies),
    theatreGetMovieCollectionController : new TheatreGetMovieCollectionController(dependencies),
    theatreGetLatestOrdersController : new TheatreGetLatestOrdersController(dependencies),
    adminGetHighGrossMoviesController : new AdminGetHighGrossMoviesController(dependencies),
    userCancelTicketController : new UserCancelTicketController(dependencies),
    theatreCollectionReportController : new TheatreCollectionReportController(dependencies)
}

bookingRouter.post('/getshowbookingstatus',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetShowBookingController.getShowBooking(req,res,next)})
bookingRouter.post('/cancelshowbookings',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreShowCancellationController.showCancellation(req,res,next)})
bookingRouter.post('/getshowdata',(req,res,next)=>{controllers.userGetShowDataController.getShowData(req,res,next)})
bookingRouter.post('/getshowdatabymovie',(req,res,next)=>{controllers.userGetShowByMovieController.getShowByMovie(req,res,next)})
bookingRouter.post('/getsingleshowdata',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userGetSingleShowDataController.getSingleShowData(req,res,next)})
bookingRouter.post('/reserveseat',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userSeatReservationController.seatReservation(req,res,next)})
bookingRouter.post('/initiatepayment',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userPaymentInitiateController.initiatePayment(req,res,next)})
bookingRouter.post('/paymentprocess',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userPaymentProcessController.processPayment(req,res,next)})
bookingRouter.post('/getorders',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userGetOrdersController.getOrders(req,res,next)})
bookingRouter.post('/getscreenbookings',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetScreenBookingsController.getScreenBookings(req,res,next)})
bookingRouter.post('/getsingleshow',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetSingleShowController.getSingleShow(req,res,next)})
bookingRouter.post('/getcompletebookings',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetCompleteOrdersController.getCompleteOrders(req,res,next)})
bookingRouter.post('/bookseat',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreBookSeatController.bookSeat(req,res,next)})
bookingRouter.post('/getupcomingmovies',AuthHandler.isPassWithin,(req,res,next)=>{controllers.userGetUpcomingMoviesController.getUpcomingMovies(req,res,next)})
bookingRouter.post('/getrecommendedmovies',AuthHandler.isPassWithin,(req,res,next)=>{controllers.userGetRecommendedMoviesController.getRecommendedMovies(req,res,next)})
bookingRouter.post('/getscreencollection',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetScreenCollectionController.getScreenCollection(req,res,next)})
bookingRouter.get('/getmoviecollection',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetMovieCollectionController.getMovieCollection(req,res,next)})
bookingRouter.get('/getlatestorders',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetLatestOrdersController.getLatestOrders(req,res,next)})
bookingRouter.get('/gethighgrossmovies',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetHighGrossMoviesController.getHighGrossMovies(req,res,next)})
bookingRouter.post('/cancelticket',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userCancelTicketController.cancelTicket(req,res,next)})
bookingRouter.post('/collectionreport',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreCollectionReportController.generateReport(req,res,next)})

export default bookingRouter
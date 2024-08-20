import express from 'express';
import { AuthHandler } from '../middlewares/auth-handler.js';
const theatreRouter = express.Router();
import dependencies from '../../frameworks/dependencies.js';
import {  TheatreAddScreenController, TheatreChangeShowMovieController, TheatreChangeTierOrderController, TheatreEditScreenController, TheatreEditTierController, TheatreEnrollMovieController, TheatreExtendMovieController, TheatreGetRunningMoviesController, TheatreGetTheatreScreenController, TheatreRemoveMovieController, UserGetSingleTheatreController, UserGetTheatresController, UserSetMovieReminderController, UserTheatreQueryController } from '../controllers/index.js';

const controllers = {
    userGetTheatresController : new UserGetTheatresController(dependencies),
    theatreGetTheatreScreenController : new TheatreGetTheatreScreenController(dependencies),
    theatreAddScreenController : new TheatreAddScreenController(dependencies),
    theatreEnrollMovieController : new TheatreEnrollMovieController(dependencies),
    theatreEditScreenController : new TheatreEditScreenController(dependencies),
    theatreRemoveMovieController : new TheatreRemoveMovieController(dependencies),
    theatreExtendMovieController : new TheatreExtendMovieController(dependencies),
    theatreEditTierController : new TheatreEditTierController(dependencies),
    theatreChangeTierOrderController : new TheatreChangeTierOrderController(dependencies),
    userGetSingleTheatreController : new UserGetSingleTheatreController(dependencies),
    theatreChangeShowMovieController : new TheatreChangeShowMovieController(dependencies),
    userTheatreQueryController : new UserTheatreQueryController(dependencies),
    userSetMovieReminderController : new UserSetMovieReminderController(dependencies),
    theatreGetRunningMoviesController : new TheatreGetRunningMoviesController(dependencies)
}

theatreRouter.post('/gettheatres',(req,res,next)=>{controllers.userGetTheatresController.getTheatres(req,res,next)})
theatreRouter.post('/getsingletheatre',(req,res,next)=>{controllers.userGetSingleTheatreController.getSingleTheatre(req,res,next)})
theatreRouter.post('/querytheatre',(req,res,next)=>{controllers.userTheatreQueryController.theatreQuery(req,res,next)})
theatreRouter.post('/setreminder',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userSetMovieReminderController.setMovieReminder(req,res,next)})

theatreRouter.post('/gettheatredata',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetTheatreScreenController.getTheatreScreen(req,res,next)})
theatreRouter.post('/addscreen',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreAddScreenController.addScreen(req,res,next)})
theatreRouter.post('/enrollmovie',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreEnrollMovieController.enrollMovie(req,res,next)})
theatreRouter.post('/editscreen',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreEditScreenController.editScreen(req,res,next)})
theatreRouter.post('/removemoviefromscreen',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreRemoveMovieController.removeMovie(req,res,next)})
theatreRouter.post('/extendmovieforscreen',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreExtendMovieController.extendMovie(req,res,next)})
theatreRouter.post('/edittier',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreEditTierController.editTier(req,res,next)})
theatreRouter.post('/changetierorder',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreChangeTierOrderController.changeTierOrder(req,res,next)})
theatreRouter.post('/changeshowmovie',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreChangeShowMovieController.changeShowMovie(req,res,next)})
theatreRouter.get('/getrunningmovies',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetRunningMoviesController.getRunningMovies(req,res,next)})
export default theatreRouter
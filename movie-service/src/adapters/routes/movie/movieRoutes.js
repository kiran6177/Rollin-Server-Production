import express from 'express';
import { AuthHandler } from '../../middlewares/auth-handler.js'
import { AdminAddMovieToDBController, AdminDisableMovieController, AdminEnableMovieController, AdminGetAllTMDBMoviesController, AdminGetMoviesFromDBController, AdminGetPersonsFromDBController, AdminGetRecentMoviesController, AdminGetTMDBMovieDetailController, TheatreGetAllMoviesController, UserAddReviewController, UserGetAllMoviesWithFilterController, UserGetBannerMoviesController, UserGetMoviesByGenreController, UserGetPersonController, UserGetRecommendedMoviesController, UserGetReviewController, UserGetSingleMovieController, UserLikeUnlikeReviewController, UserMovieQueryController } from '../../controllers/index.js';
import dependencies from '../../../frameworks/dependencies.js';
const movieRouter = express.Router();

const controllers = {
    adminGetAllTMDBMoviesController : new AdminGetAllTMDBMoviesController(dependencies),
    adminGetTMDBMovieDetailController : new AdminGetTMDBMovieDetailController(dependencies),
    adminAddMovieToDBController : new AdminAddMovieToDBController(dependencies),
    adminGetMoviesFromDBController : new AdminGetMoviesFromDBController(dependencies),
    adminGetPersonsFromDBController : new AdminGetPersonsFromDBController(dependencies),
    userGetBannerMoviesController : new UserGetBannerMoviesController(dependencies),
    userGetMoviesByGenreController : new UserGetMoviesByGenreController(dependencies),
    userGetAllMoviesWithFilter : new UserGetAllMoviesWithFilterController(dependencies),
    theatreGetAllMoviesController : new TheatreGetAllMoviesController(dependencies),
    userGetPersonController : new UserGetPersonController(dependencies),
    userGetSingleMovieController : new UserGetSingleMovieController(dependencies),
    adminDisableMovieController : new AdminDisableMovieController(dependencies),
    adminEnableMovieController : new AdminEnableMovieController(dependencies),
    userMovieQueryController : new UserMovieQueryController(dependencies),
    userAddReviewController : new UserAddReviewController(dependencies),
    userGetReviewController : new UserGetReviewController(dependencies),
    userLikeUnlikeReviewController : new UserLikeUnlikeReviewController(dependencies),
    adminGetRecentMoviesController : new AdminGetRecentMoviesController(dependencies)
}
movieRouter.post('/getalltmdbmovies',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetAllTMDBMoviesController.getAllTMDBMovies(req,res,next)})
movieRouter.post('/gettmdbmoviedetail',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetTMDBMovieDetailController.getTMDBMovieDetail(req,res,next)})
movieRouter.post('/addmovietodb',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminAddMovieToDBController.addMovieToDB(req,res,next)})
movieRouter.post('/getallmovies',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetMoviesFromDBController.getMoviesFromDB(req,res,next)})
movieRouter.post('/getallpersons',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetPersonsFromDBController.getPersonsFromDB(req,res,next)})
movieRouter.post('/disablemovie',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminDisableMovieController.disableMovie(req,res,next)})
movieRouter.post('/enablemovie',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminEnableMovieController.enableMovie(req,res,next)})
movieRouter.get('/getrecentmovies',AuthHandler.isAdminLogin,(req,res,next)=>{controllers.adminGetRecentMoviesController.getRecentMovies(req,res,next)})

movieRouter.post('/getbanners',(req,res,next)=>{controllers.userGetBannerMoviesController.getBannerMovies(req,res,next)})
movieRouter.post('/getmoviesbygenre',(req,res,next)=>{controllers.userGetMoviesByGenreController.getMoviesByGenre(req,res,next)})
movieRouter.post('/getallmovieswithfilters',(req,res,next)=>{controllers.userGetAllMoviesWithFilter.getAllMoviesWithFilter(req,res,next)})
movieRouter.post('/getperson',(req,res,next)=>{controllers.userGetPersonController.getPerson(req,res,next)})
movieRouter.post('/getsinglemovie',(req,res,next)=>{controllers.userGetSingleMovieController.getSingleMovie(req,res,next)})
movieRouter.post('/querymovie',(req,res,next)=>{controllers.userMovieQueryController.movieQuery(req,res,next)})
movieRouter.post('/addreview',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userAddReviewController.addReview(req,res,next)})
movieRouter.post('/getreviews',(req,res,next)=>{controllers.userGetReviewController.getReview(req,res,next)})
movieRouter.post('/likeunlikereview',AuthHandler.isUserLogin,(req,res,next)=>{controllers.userLikeUnlikeReviewController.likeUnlikeReview(req,res,next)})

movieRouter.post('/getmoviesfortheatre',AuthHandler.isTheatreLogin,(req,res,next)=>{controllers.theatreGetAllMoviesController.getAllMovies(req,res,next)})


export default movieRouter


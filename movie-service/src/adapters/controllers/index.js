import { UserCreatedConsume } from "./consumeController/user-created-consume.js";
import { TheatreCreatedConsume } from "./consumeController/theatre-created-consume.js";
import { TheatreUpdatedConsume } from "./consumeController/theatre-updated-consume.js";
import { UserUpdatedConsume } from "./consumeController/user-updated-consume.js";
import { MovieEnrolledConsume } from "./consumeController/movie-enrolled-consumer.js";
import { MovieRemovedConsume } from "./consumeController/movie-removed-consumer.js";
import { MovieStatusUpdatedConsume } from "./consumeController/movie-status-update-consumer.js";

import { AdminGetAllTMDBMovies } from "./admin/adminGetTMDBAllMovieController.js";
import { AdminGetTMDBMovieDetail } from "./admin/adminGetTMDBMovieDetailController.js";
import { AdminAddMovieToDB } from "./admin/adminAddMovieToDBController.js";
import { AdminGetMoviesFromDB } from "./admin/adminGetMovieFromDBController.js";
import { AdminGetPersonsFromDB } from "./admin/adminGetPersonsController.js";
import { AdminDisableMovie } from "./admin/adminDisableMovieController.js";
import { AdminEnableMovie } from "./admin/adminEnableMovieController.js";
import { AdminGetRecentMovies } from "./admin/adminGetRecentMoviesController.js";

import { UserGetBannerMovies } from "./user/userGetBannerMoviesController.js";
import { UserGetMoviesByGenre } from "./user/userGetMoviesByGenreController.js";
import { UserGetAllMoviesWithFilter } from "./user/userGetAllMovieswithFilterController.js";
import { UserGetRecommendedMovies } from "./user/userGetRecommendedMoviesController.js";
import { UserGetPerson } from "./user/userGetPersonController.js";
import { UserGetSingleMovie } from "./user/userGetSingleMovieController.js";
import { UserMovieQuery } from "./user/userMovieQueryController.js";
import { UserAddReview } from "./user/userAddReviewController.js";
import { UserGetReview } from "./user/userGetReviewsController.js";
import { UserLikeUnlikeReview } from "./user/userLikeUnlikeReviewController.js";

import { TheatreGetAllMovies } from "./theatre/theatreGetMoviesController.js";

export {
    UserCreatedConsume as UserCreatedConsumeController,
    TheatreCreatedConsume as TheatreCreatedConsumeController,
    TheatreUpdatedConsume as TheatreUpdatedConsumeController,
    UserUpdatedConsume as UserUpdatedConsumeController,
    MovieEnrolledConsume as MovieEnrolledConsumeController,
    MovieRemovedConsume as MovieRemovedConsumeController,
    MovieStatusUpdatedConsume as MovieStatusUpdatedConsumeController,
    AdminGetAllTMDBMovies as AdminGetAllTMDBMoviesController,
    AdminGetTMDBMovieDetail as AdminGetTMDBMovieDetailController,
    AdminAddMovieToDB as AdminAddMovieToDBController,
    AdminGetMoviesFromDB as AdminGetMoviesFromDBController,
    AdminGetPersonsFromDB as AdminGetPersonsFromDBController,
    UserGetBannerMovies as UserGetBannerMoviesController,
    UserGetMoviesByGenre as UserGetMoviesByGenreController,
    UserGetAllMoviesWithFilter as UserGetAllMoviesWithFilterController,
    TheatreGetAllMovies as TheatreGetAllMoviesController,
    UserGetRecommendedMovies as UserGetRecommendedMoviesController,
    UserGetPerson as UserGetPersonController,
    UserGetSingleMovie as UserGetSingleMovieController,
    AdminDisableMovie as AdminDisableMovieController,
    AdminEnableMovie as AdminEnableMovieController,
    UserMovieQuery as UserMovieQueryController,
    UserAddReview as UserAddReviewController,
    UserGetReview as UserGetReviewController,
    UserLikeUnlikeReview as UserLikeUnlikeReviewController,
    AdminGetRecentMovies as AdminGetRecentMoviesController
}
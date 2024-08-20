import { MongoMovieRepository, MongoPersonRepository, MongoReviewRepository, MongoTheatreRepository, MongoUserRepository } from '../adapters/repositories/index.js'
import { AddMovieToTheatre, AddTheatreUseCase, AddUserUseCase, AdminAllTMDBMoviesGet, AdminMovieDisable, AdminMovieEnable, AdminMovieToDBAdd, AdminMoviesFromDBGet, AdminPersonsFromDBGet, AdminRecentMoviesGet, AdminTMDBMovieDetailGet, RemoveMovieFromTheatre, TheatreAllMoviesGet, UpdateMovieStatusUseCase, UpdateTheatreUseCase, UpdateUserUseCase, UserAllMoviesWithFilterGet, UserBannerMoviesGet, UserMoviesByGenreGet, UserPersonGet, UserQueryMovie, UserRecommendedMoviesGet, UserReviewAdd, UserReviewGet, UserReviewLikeUnlike, UserSingleMovieGet } from '../usecases/index.js'

const ConsumeUseCase = {
    AddUserUseCase,
    AddTheatreUseCase,
    UpdateTheatreUseCase,
    UpdateUserUseCase,
    AddMovieToTheatre,
    RemoveMovieFromTheatre,
    UpdateMovieStatusUseCase
}

const Repositories = {
    MongoUserRepository,
    MongoTheatreRepository,
    MongoPersonRepository,
    MongoMovieRepository,
    MongoReviewRepository
}

const UseCase = {
    AdminAllTMDBMoviesGet,
    AdminTMDBMovieDetailGet,
    AdminMovieToDBAdd,
    AdminMoviesFromDBGet,
    AdminPersonsFromDBGet,
    UserBannerMoviesGet,
    UserMoviesByGenreGet,
    UserAllMoviesWithFilterGet,
    TheatreAllMoviesGet,
    UserRecommendedMoviesGet,
    UserPersonGet,
    UserSingleMovieGet,
    AdminMovieDisable,
    AdminMovieEnable,
    UserQueryMovie,
    UserReviewAdd,
    UserReviewGet,
    UserReviewLikeUnlike,
    AdminRecentMoviesGet
}

const dependencies = {
    UseCase,
    ConsumeUseCase,
    Repositories
}

export default dependencies
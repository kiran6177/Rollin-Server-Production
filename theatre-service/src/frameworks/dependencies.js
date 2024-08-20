import { AddTheatreUseCase, AddUserUseCase, TheatreMovieEnroll, TheatreMovieExtend, TheatreMovieRemove, TheatreRunningMoviesGet, TheatreScreenAdd, TheatreScreenDataGet, TheatreScreenEdit, TheatreShowMovieChange, TheatreTierEdit, TheatreTierOrderChange, UpdateTheatreUseCase, UpdateUserUseCase, UserMovieReminderSet, UserQueryTheatre, UserSingleTheatreGet, UserTheatresGet } from '../usecases/index.js'
import { MongoReminderRepository, MongoScreenRepository, MongoTheatreRepository , MongoUserRepository } from '../adapters/repositories/index.js'

const ConsumeUseCase = {
    AddUserUseCase,
    AddTheatreUseCase,
    UpdateTheatreUseCase,
    UpdateUserUseCase
}

const Repositories = {
    MongoTheatreRepository,
    MongoUserRepository,
    MongoScreenRepository,
    MongoReminderRepository
}

const UseCase = {
    UserTheatresGet,
    TheatreScreenDataGet,
    TheatreScreenAdd,
    TheatreMovieEnroll,
    TheatreScreenEdit,
    TheatreMovieRemove,
    TheatreMovieExtend,
    TheatreTierEdit,
    TheatreTierOrderChange,
    UserSingleTheatreGet,
    TheatreShowMovieChange,
    UserQueryTheatre,
    UserMovieReminderSet,
    TheatreRunningMoviesGet
}

const dependencies = {
    UseCase,
    ConsumeUseCase,
    Repositories
}

export default dependencies
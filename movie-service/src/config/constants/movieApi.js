export const MOVIE_URL = 'https://api.themoviedb.org/3/discover/movie'
export const IMAGE_URL = 'https://image.tmdb.org/t/p/original'
export const BASE_MOVIE_URL = 'https://api.themoviedb.org/3/movie'
export const UNKNOWN_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLVQWm0gocTw1yyhcV1sEMyfrenm4uYHF1HeYmZtq6g&s'
export const SEARCH_MOVIE_URL = 'https://api.themoviedb.org/3/search/movie'
export const PERSON_URL = 'https://api.themoviedb.org/3/person'

//for credits = BASE_MOVIE_URL+/{movie_id}/credits
//for videos = 'BASE_MOVIE_URL+/{movie_id}/videos?language=en-US';
//with filters = 'MOVIE_URL+?include_adult=false&include_video=false&language=ml&page=1&primary_release_year=2024&region=IN&sort_by=popularity.desc&with_genres=18&with_origin_country=IN&with_original_language=ml';
//now_Playing = BASE_MOVIE_URL+/now_playing?language=en-US&page=1&region=IN';
//popular = BASE_MOVIE_URL+/popular?language=en-US&page=1&region=IN';
//top_rated = BASE_MOVIE_URL+/top_rated?language=en-US&page=1&region=IN';
//upcoming = BASE_MOVIE_URL+/upcoming?language=en-US&page=1&region=IN';
//videos = 'BASE_MOVIE_URL+/{movie_id}/videos?language=en-US';
//details = 'BASE_MOVIE_URL+/{movie_id}?language=en-US';
//details w/ videos = BASE_MOVIE_URL+/${157336}?language=en-US&append_to_response=videos`
//search = SEARCH_MOVIE_URL+?query=${Jack+Reacher}

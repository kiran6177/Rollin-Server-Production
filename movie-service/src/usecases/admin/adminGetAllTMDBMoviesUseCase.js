import { IMAGE_URL, MOVIE_URL, SEARCH_MOVIE_URL } from '../../config/constants/movieApi.js';
import { findGenre } from '../../utils/findGenre.js';
import tmdbAxios from '../../utils/tmdbAxios.js'

export class AdminAllTMDBMoviesGet{
    constructor(dependencies){

    }

    async execute({filters}){
        try {
            console.log(filters);
            const searchQuery = filters?.query ? filters.query : ''   
            const sortValue = filters?.sort ? filters.sort : 'primary_release_date.desc'
            const languageValue = filters?.lang ? filters.lang : 'ml'
            const pageValue = filters?.page ? filters.page : 1 ;
            const genreValue = filters?.genre ? filters.genre : ""
            console.log(pageValue);
            let response;
            if(searchQuery !== ''){
                response = await tmdbAxios.get(SEARCH_MOVIE_URL+`?query=${searchQuery}&page=${pageValue}`)
                console.log("SEARCH");
            }else{
                response = await tmdbAxios.get(MOVIE_URL+`?page=${pageValue}&sort_by=${sortValue}&with_original_language=${languageValue}&region=IN&with_genres=${genreValue}`);
                console.log("DISCOVER");
            }
            console.log(response.data);
            let filteredData = [];
                if(response?.data?.results?.length > 0 ){
                    for(let movie of response.data.results){
                        if(movie?.backdrop_path && movie?.poster_path ){
                            let genres = movie?.genre_ids?.length > 0 ? findGenre(movie.genre_ids) : []
                            filteredData.push({
                                movie_id:movie.id,
                                title:movie.title,
                                backdrop_path:IMAGE_URL+movie.backdrop_path,
                                poster_path:IMAGE_URL+movie.poster_path,
                                language:movie.original_language,
                                overview:movie.overview,
                                release_date:movie.release_date,
                                popularity:movie.popularity,
                                rating:movie.vote_average,
                                genres:genres,
                                page:response.data.page
                            })
                        }
                    }
                }else{
                    //No movies
                }
            console.log("FILTERED",filteredData);
            return  filteredData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
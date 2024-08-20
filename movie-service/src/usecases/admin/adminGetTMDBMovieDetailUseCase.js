import { BASE_MOVIE_URL, IMAGE_URL, UNKNOWN_IMAGE } from '../../config/constants/movieApi.js';
import { findLang } from '../../utils/findGenre.js';
import tmdbAxios from '../../utils/tmdbAxios.js'

export class AdminTMDBMovieDetailGet{
    constructor(dependencies){

    }

    async execute({movieid}){
        try {
            console.log(movieid);
            const response = await tmdbAxios.get(BASE_MOVIE_URL+`/${movieid}?append_to_response=videos`)//moviedetail with video links
            console.log(response.data);
            const creditsResponse = await tmdbAxios.get(BASE_MOVIE_URL+`/${movieid}/credits`)//moviedetail with credits
            // console.log(creditsResponse.data);
            const detail = response.data;
            const castCrew = creditsResponse.data;
            let refactoredData;
            if(detail){
                refactoredData = {
                    movie_id:detail.id,
                    title:detail.title,
                    backdrop_path:IMAGE_URL+detail.backdrop_path,
                    poster_path:IMAGE_URL+detail.poster_path,
                    language:findLang(detail.original_language),
                    overview:detail.overview,
                    release_date:detail.release_date,
                    popularity:detail.popularity,
                    rating:detail.vote_average,
                    genres:detail.genres,
                    video_link:detail.videos?.results.length > 0 ? detail.videos?.results[0].key : null,
                    runtime:detail.runtime,
                    
                }
            }
            if(castCrew?.cast && castCrew.cast.length > 0){
                let castList = [];
                if(castCrew.cast.length < 7){
                    for(let person of castCrew.cast){
                        castList.push({
                            name:person.name,
                            person_id:person.id,
                            department:person.known_for_department,
                            character:person.character,
                            profile_path:person?.profile_path ? IMAGE_URL+person?.profile_path : UNKNOWN_IMAGE
                        })
                    }
                }else{
                    for(let i = 0 ; i < 7;i++){
                        castList.push({
                            name:castCrew.cast[i].name,
                            person_id:castCrew.cast[i].id,
                            department:castCrew.cast[i].known_for_department,
                            character:castCrew.cast[i].character,
                            profile_path:castCrew.cast[i]?.profile_path ? IMAGE_URL+castCrew.cast[i]?.profile_path : UNKNOWN_IMAGE
                        })
                    }
                }
                refactoredData.cast = castList
            }
            if(castCrew?.crew && castCrew.crew.length > 0){
                let crewList = [];
                if(castCrew.crew.length < 7){
                    for(let person of castCrew.crew){
                        crewList.push({
                            name:person.name,
                            person_id:person.id,
                            department:person.known_for_department,
                            image:person?.profile_path ? IMAGE_URL+person?.profile_path : UNKNOWN_IMAGE
                        })
                    }
                }else{
                    for(let i = 0 ; i < 7;i++){
                        crewList.push({
                            name:castCrew.crew[i].name,
                            person_id:castCrew.crew[i].id,
                            department:castCrew.crew[i].known_for_department,
                            image:castCrew.crew[i]?.profile_path ? IMAGE_URL+castCrew.crew[i]?.profile_path :  UNKNOWN_IMAGE
                        })
                    }
                }
                refactoredData.crew = crewList
            }
            console.log(refactoredData);
            return refactoredData
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
import { GENDER } from '../config/constants/movie-constants/gender.js';
import { GENRES } from '../config/constants/movie-constants/genres.js';
import { languages } from '../config/constants/movie-constants/languages.js';

export const findGenre = (movieGenre)=>{
    const results = []
    movieGenre.map(genre=>{
        GENRES.forEach(obj => {
            if(obj.id === genre){
                results.push(obj.name)
            }
        });
    })
    return results;
}

export const findLang = (code)=>{
    let language;
    languages.forEach(lang=>{
        if(lang.code === code){
            language = lang.english_name
        }
    })
    return language
}

export const findGender = (key)=>{
    return GENDER[key]
}
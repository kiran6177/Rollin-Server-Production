import { BASE_MOVIE_URL, IMAGE_URL, PERSON_URL, UNKNOWN_IMAGE } from '../../config/constants/movieApi.js';
import { Movie } from '../../entities/movieEntity.js';
import { Person } from '../../entities/personEntity.js';
import { AwsConfig } from '../../utils/aws-s3.js';
import { GenerateImage } from '../../utils/createBuffer.js';
import { findGender, findLang } from '../../utils/findGenre.js';
import tmdbAxios from '../../utils/tmdbAxios.js'
const MOVIE_OWNER = 'movie';
const PEOPLE_OWNER = 'people'

export class AdminMovieToDBAdd{
    constructor(dependencies){
        this.movieRepository = new dependencies.Repositories.MongoMovieRepository()
        this.personRepository = new dependencies.Repositories.MongoPersonRepository()
        this.awsConfig = new AwsConfig()
    }

    async execute({movieid,release_date}){
        try {
            console.log(movieid);
            if(!movieid){
                const error = new Error();
                error.statusCode = 400;
                error.reasons = ['Invalid MovieID']
                throw error
            }else if(!release_date || new Date(release_date) < new Date()){
                const error = new Error();
                error.statusCode = 400;
                error.reasons = ['Invalid Release Date']
                throw error
            }else{
                const response = await tmdbAxios.get(BASE_MOVIE_URL+`/${movieid}?append_to_response=videos`)//moviedetail with video links
                const creditsResponse = await tmdbAxios.get(BASE_MOVIE_URL+`/${movieid}/credits`)//moviedetail with credits
                const detail = response.data;
                const castCrew = creditsResponse.data;
                let refactoredData;
                const isMovieExist = await this.movieRepository.findMovieByMovieId(detail.id)
                if(isMovieExist !== null){
                    const error = new Error()
                    error.statusCode = 500
                    error.reasons = ['Movie Already exists!!']
                    throw error;
                }else{
                    if(detail){
                        refactoredData = {
                            movie_id:detail.id,
                            title:detail.title,
                            language:findLang(detail.original_language),
                            overview:detail.overview,
                            release_date:new Date(release_date),
                            popularity:detail.popularity,
                            rating:detail.vote_average,
                            genres:detail.genres,
                            video_link:detail.videos?.results.length > 0 ? detail.videos?.results[0].key : null,
                            runtime:detail.runtime,
                            createdAt:new Date()
                        }
                        if(detail.backdrop_path){
                            const {trimmed,fileBuffer,mimeType} = await GenerateImage('banner'+detail.title+detail.id,detail.backdrop_path)
                            refactoredData.backdrop_path = trimmed;
                            await this.awsConfig.uploadImage(trimmed,fileBuffer,mimeType,MOVIE_OWNER)
                            console.log('UPLOADED');
                        }
                        if(detail.poster_path){
                            const {trimmed,fileBuffer,mimeType} = await GenerateImage('poster'+detail.title+detail.id,detail.poster_path)
                            refactoredData.poster_path = trimmed;
                            await this.awsConfig.uploadImage(trimmed,fileBuffer,mimeType,MOVIE_OWNER)
                            console.log('UPLOADED');
                        }
                    }
    
                    //CAST-SECTION
    
                    if(castCrew?.cast && castCrew.cast.length > 0){
                        let castList = [];
                        if(castCrew.cast.length < 7){
                            for(let person of castCrew.cast){
                                const personDataResponse = await tmdbAxios.get(PERSON_URL+`/${person.id}`)
                                const personData = personDataResponse.data;
                                let filename;
                                if(personData?.profile_path){
                                    const {trimmed,fileBuffer,mimeType} = await GenerateImage(personData.name,personData.profile_path)
                                    filename = trimmed;
                                    await this.awsConfig.uploadImage(trimmed,fileBuffer,mimeType,PEOPLE_OWNER)
                                    console.log('UPLOADED');
                                }
                                const personToAdd = {
                                    person_id:personData.id,
                                    name:personData.name,
                                    biography:personData.biography,
                                    birthday:new Date(personData.birthday),
                                    gender:findGender(personData.gender),
                                    birth_place:personData.place_of_birth,
                                    department:personData.known_for_department,
                                    profile_path:filename,
                                }
                                const personInstance = new Person(personToAdd)
                                const isPersonExist = await this.personRepository.findPersonByPersonId(personInstance.person_id);
                                let personIdToStore;
                                if(isPersonExist !== null){
                                    personIdToStore = isPersonExist._id
                                }else{
                                    const addPersonToDB = await this.personRepository.createPerson(personInstance)
                                    personIdToStore = addPersonToDB._id
                                }
                                // console.log(addPersonToDB);
                                castList.push({
                                    cast_id:personIdToStore,
                                    character:person.character,
                                })
                            }
                        }else{
                            for(let i = 0 ; i < 7;i++){
                                const personDataResponse = await tmdbAxios.get(PERSON_URL+`/${castCrew.cast[i].id}`)
                                const personData = personDataResponse.data
                                let filename;
                                if(personData?.profile_path){
                                    const {trimmed,fileBuffer,mimeType} = await GenerateImage(personData.name,personData.profile_path)
                                    filename = trimmed;
                                    await this.awsConfig.uploadImage(trimmed,fileBuffer,mimeType,PEOPLE_OWNER)
                                    console.log('UPLOADED');
                                }
                                const personToAdd = {
                                    person_id:personData.id,
                                    name:personData.name,
                                    biography:personData.biography,
                                    birthday:new Date(personData.birthday),
                                    gender:findGender(personData.gender),
                                    birth_place:personData.place_of_birth,
                                    department:personData.known_for_department,
                                    profile_path:filename,
                                }
                                const personInstance = new Person(personToAdd)
                                const isPersonExist = await this.personRepository.findPersonByPersonId(personInstance.person_id);
                                let personIdToStore;
                                if(isPersonExist !== null){
                                    personIdToStore = isPersonExist._id
                                }else{
                                    const addPersonToDB = await this.personRepository.createPerson(personInstance)
                                    personIdToStore = addPersonToDB._id
                                }
                                // console.log(addPersonToDB);
                                castList.push({
                                    cast_id:personIdToStore,
                                    character:castCrew.cast[i].character,
                                })
                            }
                        }
                        refactoredData.cast = castList
                    }
    
                    //CREW-SECTION
    
                    if(castCrew?.crew && castCrew.crew.length > 0){
                        let crewList = [];
                        if(castCrew.crew.length < 7){
                            for(let person of castCrew.crew){
                                const personDataResponse = await tmdbAxios.get(PERSON_URL+`/${person.id}`)
                                const personData = personDataResponse.data
                                let filename;
                                if(personData?.profile_path){
                                    const {trimmed,fileBuffer,mimeType} = await GenerateImage(personData.name,personData.profile_path)
                                    filename = trimmed;
                                    await this.awsConfig.uploadImage(trimmed,fileBuffer,mimeType,PEOPLE_OWNER)
                                    console.log('UPLOADED');
                                }
                                const personToAdd = {
                                    person_id:personData.id,
                                    name:personData.name,
                                    biography:personData.biography,
                                    birthday:new Date(personData.birthday),
                                    gender:findGender(personData.gender),
                                    birth_place:personData.place_of_birth,
                                    department:personData.known_for_department,
                                    profile_path:filename,
                                }
                                const personInstance = new Person(personToAdd)
                                const isPersonExist = await this.personRepository.findPersonByPersonId(personInstance.person_id);
                                let personIdToStore;
                                if(isPersonExist !== null){
                                    personIdToStore = isPersonExist._id
                                }else{
                                    const addPersonToDB = await this.personRepository.createPerson(personInstance)
                                    personIdToStore = addPersonToDB._id
                                }
                                // console.log(addPersonToDB);
                                crewList.push({
                                    crew_id:personIdToStore
                                })
                            }
                        }else{
                            for(let i = 0 ; i < 7;i++){
                                const personDataResponse = await tmdbAxios.get(PERSON_URL+`/${castCrew.crew[i].id}`)
                                const personData = personDataResponse.data
                                let filename;
                                if(personData?.profile_path){
                                    const {trimmed,fileBuffer,mimeType} = await GenerateImage(personData.name,personData.profile_path)
                                    filename = trimmed;
                                    await this.awsConfig.uploadImage(trimmed,fileBuffer,mimeType,PEOPLE_OWNER)
                                    console.log('UPLOADED');
                                }
                                const personToAdd = {
                                    person_id:personData.id,
                                    name:personData.name,
                                    biography:personData.biography,
                                    birthday:new Date(personData.birthday),
                                    gender:findGender(personData.gender),
                                    birth_place:personData.place_of_birth,
                                    department:personData.known_for_department,
                                    profile_path:filename,
                                }
                                const personInstance = new Person(personToAdd)
                                const isPersonExist = await this.personRepository.findPersonByPersonId(personInstance.person_id);
                                let personIdToStore;
                                if(isPersonExist !== null){
                                    personIdToStore = isPersonExist._id
                                }else{
                                    const addPersonToDB = await this.personRepository.createPerson(personInstance)
                                    personIdToStore = addPersonToDB._id
                                }
                                // console.log(addPersonToDB);
                                crewList.push({
                                    crew_id:personIdToStore
                                })
                            }
                        }
                        refactoredData.crew = crewList
                    }
                    console.log(refactoredData);
                    const movieToDB = new Movie(refactoredData)
                    console.log("DB",movieToDB);
                    const addMovie = await this.movieRepository.createMovie(movieToDB)
                    console.log("FROM DB",addMovie);
                    return true
                }
            }
        } catch (err) {
            console.log(err);
            const error = new Error()
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}
import { IMAGE_URL } from '../config/constants/movieApi.js';
import tmdbAxios from './tmdbAxios.js'
export const GenerateImage = async (name,path)=>{
    try {
        const response = await tmdbAxios.get(IMAGE_URL+`/${path}`, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data, 'binary');
        const contentType = response.headers['content-type'];
        const extension = contentType.split('/')[1]; 
        const filename = Date.now()+name+'.'+extension;
        const trimmed = filename.replace(/\s+/g, "");
        return {trimmed,fileBuffer,mimeType:contentType}
    } catch (error) {
        console.log(error);
        return new Error(error)
    }
}
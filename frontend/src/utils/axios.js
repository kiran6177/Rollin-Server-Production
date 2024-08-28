import axios from 'axios';

const instance =  axios.create({
        baseURL:'https://rollinmovie.online/api',
        withCredentials:true
    })

    

export default instance
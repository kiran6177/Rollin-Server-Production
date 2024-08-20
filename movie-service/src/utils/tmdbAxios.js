import axios from "axios";

const instance = axios.create({
    headers:{
        Authorization:`Bearer ${process.env.TMDB_TOKEN}`
    }
})

export default instance;
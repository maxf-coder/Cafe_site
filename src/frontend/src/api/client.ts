import axios from "axios";

const apiClient = axios.create({
    baseURL: `http://${window.location.hostname}:8000/api/v1/`
})

apiClient.interceptors.request.use((config) =>{
    const lang = localStorage.getItem("lang") || "ro"
    config.params = { ...config.params, lang}
    return config
})

export default apiClient
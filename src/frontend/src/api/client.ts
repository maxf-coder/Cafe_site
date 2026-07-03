import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/"
})

apiClient.interceptors.request.use((config) =>{
    const lang = localStorage.getItem("lang") || "ro"
    config.params = { ...config.params, lang}
    return config
})

export default apiClient
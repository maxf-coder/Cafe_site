import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL
if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is required. Set it in .env or pass as --build-arg in Docker.")
}

const apiClient = axios.create({
    baseURL: apiBaseUrl
})

apiClient.interceptors.request.use((config) =>{
    const lang = localStorage.getItem("lang") || "ro"
    config.params = { ...config.params, lang}
    return config
})

export default apiClient
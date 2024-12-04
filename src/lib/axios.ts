import axios from "axios"

//creamos la instancia de axios para luego acortar las peticiones y si cambia la url base solo cambiamos aqui
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use( config => {
    const token = localStorage.getItem("AUTH_TOKEN")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
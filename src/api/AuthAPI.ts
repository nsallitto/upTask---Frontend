import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types";


// CREAR CUENTA
export async function createAccount ( formData: UserRegistrationForm ) {
    try {
        const url = '/auth/create-account'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// CONFIRMAR CUENTA
export async function confirmAccount (formData: ConfirmToken) {
    try {
        const url = '/auth/confirm-account'
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// PEDIR NUEVO CODIGO CONFIRMACION
export async function requestConfirmationCode(email: RequestConfirmationCodeForm) {
    try {
        const url = '/auth/request-code'
        const { data } = await api.post<string>(url, email)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

// INGRESAR A TU CUENTA
export async function login(formData: UserLoginForm) {
    try {
        const url = '/auth/login'
        const { data } = await api.post<string>(url, formData)

        //Guardamos el token que genera el backend
        localStorage.setItem("AUTH_TOKEN", data)
        
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}
// PEDIR CAMBIO DE CONTRASEÑA
export async function forgotPassword(formdata: ForgotPasswordForm) {
    try {
        const url = '/auth/forgot-password'
        const { data } = await api.post<string>(url, formdata)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
// VALIDAMOS TOKEN PARA CAMBIO DE CONTRASEÑA
export async function validateToken( token: ConfirmToken) {
    try {
        const url = '/auth/validate-token'
        const { data } = await api.post<string>(url, token)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
// CAMBIAMOS LA CONTRASEÑA
export async function updatePassword({formData, token} : {formData: NewPasswordForm, token: ConfirmToken["token"]}) {
    try {
        const url = `/auth/update-password/${token}`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
// OBTENEMOS USUARIO AUTENTICADO
export async function getUserAuthenticate() {
    try {
        const { data } = await api('/auth/user')
        const response = userSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//CHEQUEAMOS PASSWORD PARA PODER ELIMINAR PROYECTO
export async function checkPassword(formData: CheckPasswordForm) {
    try {
        const url = '/auth/check-password'
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
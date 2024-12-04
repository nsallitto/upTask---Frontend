import { useState } from "react"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { ConfirmToken } from "@/types/index"


export default function NewPasswordView() {

    const [token, setToken] = useState<ConfirmToken["token"]>('')
    const [isTokenValidate, setIsTokenValidate] = useState(false)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablece tu password</h1>
            <p className="text-2xl font-light text-white mt-5">
                {!isTokenValidate ? 'Ingresa el codigo que recibiste ' : "Completa el formulario y elige tu nuevo "}
                <span className=" text-fuchsia-500 font-bold">{!isTokenValidate ? 'En tu Email' : "Password"}</span>
            </p>

            {!isTokenValidate ?
                <NewPasswordToken 
                    token={token}
                    setToken={setToken}
                    setIsTokenValidate={setIsTokenValidate}
                /> :
                <NewPasswordForm 
                    token={token}
                />
            }
        </>
    )
}

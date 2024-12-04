import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { login } from "@/api/AuthAPI"
import ErrorMessage from "@/components/ErrorMessage"
import { UserLoginForm } from "@/types/index"
import { useMutation } from "@tanstack/react-query"


export default function LoginView() {

    const initialValues: UserLoginForm = {
        email: "",
        password: ""
    }
    const navigate = useNavigate()
    /** REACT HOOK FORM  */
    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})

    /** REACT QUERY USE MUTATE */
    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            navigate('/')
        }
    })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Inicia Sesión</h1>
            <p className="text-2xl font-light text-white mt-5">
                Llena el formulario para {''}
                <span className=" text-fuchsia-500 font-bold"> iniciar sesión</span>
            </p>

            <form
                className="bg-white p-10 space-y-8 mt-10"
                onSubmit={handleSubmit(handleLogin)}
            >
                <div className="flex flex-col gap-3">
                    <label
                        className="text-2xl"
                    >Email</label>

                    <input 
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full border border-gray-300 p-2"

                        {...register("email", {
                            required: "El Email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email no válido",
                            }
                        })}

                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label
                        className="text-2xl"
                    >Password</label>

                    <input 
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full border border-gray-300 p-2"
                        {...register("password", {
                            required: "El Password es obligatorio"
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input 
                    type="submit"
                    value='Iniciar Sesión'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 font-bold text-white text-xl cursor-pointer transition-colors"
                />
            </form>
        
            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to={"/auth/register"}
                    className="text-center text-gray-300 font-bold"
                >¿Aun no estas registrado? Registrate Aquí</Link>
                <Link
                    to={"/auth/forgot-password"}
                    className="text-center text-gray-300 font-bold"
                >¿Olvidaste tu contraseña? Reestablecer</Link>
            </nav>
        
        </>
    )
}

import { forgotPassword } from "@/api/AuthAPI"
import ErrorMessage from "@/components/ErrorMessage"
import { ForgotPasswordForm } from "@/types/index"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

export default function ForgotPassword() {

    const initialValues: ForgotPasswordForm = {
        email: ""
    }

    /** USE FORM */
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    /** REACT QUERY USE MUTATATION */
    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })  

    const handleForgotPassword = (formdata: ForgotPasswordForm) => mutate(formdata)

    return (
        <>
            <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
            <p className="text-2xl font-light text-white mt-5">
                Escribe tu E-mail y {''}
                <span className=" text-fuchsia-500 font-bold"> reestablece tu password</span>
            </p>

            <form 
                className="bg-white p-10 space-y-8 mt-10"
                noValidate
                onSubmit={handleSubmit(handleForgotPassword)}
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="text-2xl font-normal"
                        htmlFor="email"
                    >Email</label>

                    <input
                        id="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300"
                        type="email"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email no válido"
                            }
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Enviar Instrucciones"
                    type="submit"
                />
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to='/auth/login'
                    className="text-center text-gray-300 font-normal"
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>

                <Link
                    to='/auth/register'
                    className="text-center text-gray-300 font-normal"
                >
                    ¿No tienes cuenta? Crea una
                </Link>
            </nav>

        </>
    )
}

import { TeamMemberForm } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { findUserByEmail } from "@/api/TeamAPI"
import MemberSearchResult from "./MemberSearchResult"


export default function AddMemberForm() {

    const initialValues: TeamMemberForm = {
        email: ""
    }
    const params = useParams()
    const projectId = params.projectId!

    /** REACT FORM */
    const { register, handleSubmit, reset, formState: {errors} } = useForm({defaultValues: initialValues})

    /** REACT QUERY USE MUTATION */
    const mutation = useMutation({
        mutationFn: findUserByEmail
    })

    const handleSearchUser = async (formData: TeamMemberForm) => {
        const data = { projectId, formData }
        mutation.mutate(data)
    }

    const resetData = () => {
        reset(),
        mutation.reset()
    }

    return(
        <>
            <form
                noValidate
                onSubmit={handleSubmit(handleSearchUser)}
                className="mt-10 space-y-8"
            >
                <div className="flex flex-col gap-3">
                    <label 
                        className="text-2xl font-normal"
                        htmlFor="email">
                    E-mail de Usuario</label>
                    <input 
                        className="w-full p-3 border border-gray-300"
                        id="email"
                        type="email"
                        {...register("email",{
                            required: "El email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            }
                        })} 
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input 
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer transition-all"
                    type="submit"
                    value='Buscar'
                />
            </form>

            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Cargando...</p>}
                {mutation.error && <p className="text-center">{mutation.error.message}</p>}
                {mutation.data && <MemberSearchResult user={mutation.data} reset={resetData}/>}
            </div>
        
        </>
    )
}
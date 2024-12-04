import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"


export default function CreateProyectView() {
    const navigate = useNavigate()

    const initialValues: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })
    //una vez que pase la validacion de react-hook-form pasa ese data
    const handleForm = (formData: ProjectFormData) => mutate(formData)

    return (
        <>
            <h1 className="text-5xl font-black">Crear Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

            <nav className="mt-8">
                <Link
                    className="bg-purple-400 hover:bg-purple-500 py-3 px-10 text-white font-bold text-xl cursor-pointer transition-all"
                    to='/'
                >Volver a Proyectos</Link>
            </nav>

            <div className="max-w-3xl m-auto">
                <form
                    className="mt-10 bg-white rounded-lg shadow-lg p-10"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <ProjectForm
                        register={register}
                        errors={errors}
                    />

                    <input
                        type="submit"
                        value='Crear proyecto'
                        className="bg-fuchsia-700 hover:bg-fuchsia-800 w-full p-3 text-white uppercase font-bold rounded cursor-pointer transition-colors"
                    />

                </form>
            </div>
        </>
    )
}

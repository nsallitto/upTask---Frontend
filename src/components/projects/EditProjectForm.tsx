import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

export default function EditProjectForm({data, projectId}: EditProjectFormProps) {

    const navigate = useNavigate()
    
    const {register, handleSubmit, formState: {errors} } = useForm({defaultValues:{
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }})

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            navigate('/')
            toast.success(data)
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <h1 className="text-5xl font-black">Editar Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Modifica el siguiente formulario para editar un proyecto</p>

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
                        value='Editar proyecto'
                        className="bg-fuchsia-700 hover:bg-fuchsia-800 w-full p-3 text-white uppercase font-bold rounded cursor-pointer transition-colors"
                    />

                </form>
            </div>
        </>
    )
}

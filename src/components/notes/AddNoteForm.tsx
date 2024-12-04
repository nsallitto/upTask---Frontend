import { NoteForm } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"

export default function AddNoteForm() {
    //Obtenemos el projectId
    const params = useParams()
    const projectId = params.projectId!
    //Obtenemos el taskId
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const taskId = searchParams.get("viewTask")!

    const initialValues: NoteForm = {
        content: ""
    }
    /** LEEMOS LOS DATOS DEL FORM CON USE FORM */
    const {register, handleSubmit, reset, formState:{errors} } = useForm({defaultValues: initialValues})

    const handleNote = (formData: NoteForm) => {
        const data = {
            formData,
            projectId,
            taskId
        }
        mutate(data)
    }

    const queryClient = useQueryClient()

    /** USE MUTATION PARA CREAR NOTAS */
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            reset()
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            toast.success(data)
        }
    })

    return (
        <form
            className="space-y-3"
            onSubmit={handleSubmit(handleNote)}
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="content" className="font-bold">Crear Nota</label>
                <input
                    id="content"
                    type="text" 
                    placeholder="Contenido de la nota"
                    className="w-full p-2 border border-gray-300"
                    {...register("content", {
                        required: "El contenido de la nota es obligatorio"
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>
            <input
                type="submit" 
                className="w-full p-2 bg-fuchsia-600 hover:bg-fuchsia-500 cursor-pointer text-white font-black transition-colors"
                value="Crear Nota"
            />
        </form>
    )
}

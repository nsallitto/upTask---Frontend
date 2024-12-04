import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailsProps = {
    note: Note
}
export default function NoteDetails({ note }: NoteDetailsProps) {
    //usamos nuestro hook USE AUTH para saber que usuario esta autenticado
    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

    //Obtenemos el projectId
    const params = useParams()
    const projectId = params.projectId!
    //Obtenemos el taskId
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const taskId = searchParams.get("viewTask")!

    const queryClient = useQueryClient()
    //USE MUTATION para eliminar una nota
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            toast.success(data)
        }
    })
    if (isLoading) return "Cargando..."

    if (data) return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} ( Creardo por: <span className="font-bold">{note.createdBy.userName}</span> )
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>
            {canDelete && (
                <button
                    onClick={ () => mutate({projectId, taskId, noteId: note._id})} 
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-white font-bold cursor-pointer transition-colors"
                >Eliminar</button>
            )}
        </div>
    )
}

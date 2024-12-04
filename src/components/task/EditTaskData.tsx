import { getTaskById } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {

    //obtenemos el taskId
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const taskId = searchParams.get("editTask")!

    //obtenemos el projectId
    const params = useParams()
    const projectId = params.projectId!
    
    //realizamos la query --> enabled se ejecuta si es true --> !! en una variable nos devuelve true or false
    const { data, isError, isLoading } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId,
        retry: false
    })
    if(isError) return <Navigate to='/404' />
    if(isLoading) return 'Cargando...'
    if(data) return <EditTaskModal data={data} taskId={taskId}/>
}

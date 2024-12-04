import { useMemo } from "react"
import { Navigate, useLocation, useNavigate, useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/task/AddTaskModal"
import TaskList from "@/components/task/TaskList"
import EditTaskData from "@/components/task/EditTaskData"
import TaskModalDetails from "@/components/task/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"


export default function DetailsProjectView() {

    //obtenemos el usuario que esta autenticado
    const { data: user, isLoading: authLoading } = useAuth()

    const params = useParams()
    const projectId = params.projectId!
    const navigate = useNavigate()
    const location = useLocation()

    //realizamos la query para obtener el proyecto
    const { data, isLoading, isError} = useQuery({
        queryKey: ['detailProyect'],
        queryFn: () => getFullProject(projectId),
    })

    //fn que devuelve si el usuario es el creador
    const canEdit = useMemo(() => data?.manager === user?._id , [data,user])
    
    if(isLoading && authLoading) return 'Cargando...'
    if(isError) return <Navigate to='/404' />
    if(data && user) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            {data.manager === user._id && (
                <nav className="my-5 flex gap-3">
                <button
                    type="button"
                    className="bg-purple-400 hover:bg-purple-500 py-3 px-10 text-white font-bold text-xl cursor-pointer transition-all"
                    onClick={() => navigate(location.pathname + '?newTask=true')}
                >Agregar Tarea</button>

                <Link
                    className="bg-purple-400 hover:bg-purple-500 py-3 px-10 text-white font-bold text-xl cursor-pointer transition-all"
                    to={'team'} //--> al no agregar la / solo se agrega el "team" a la URL existente
                >Colaboradores</Link>
            </nav>
            )}
            
            <TaskList 
                tasks={data.tasks}
                canEdit={canEdit}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}

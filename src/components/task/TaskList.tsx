import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslate } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "@/api/TaskAPI"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type TaskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
}
type GroupedTask = {
    [key: string]: TaskProject[]
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()
    //USE MUTATION --> actualizamos los estados de las tareas
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["detailProyect"]})
            toast.success(data)
            
        }
    })

    //creamos los grupos de estados
    const initialStatusGroups: GroupedTask = {
        pending: [],
        onHold: [],
        inProgress: [],
        underReview: [],
        completed: []
    }

    //le damos color a cada status
    const statusColors: { [key: string]: string } = {
        pending: 'border-t-slate-500',
        onHold: 'border-t-red-500',
        inProgress: 'border-t-blue-500',
        underReview: 'border-t-amber-500',
        completed: 'border-t-emerald-500'
    }

    //fn para ordenar cada tarea segun su grupo
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup }
    }, initialStatusGroups)

    //fn que valida que soltemos la tarea en un lugar valido
    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e
        if (over && over.id) {
            const taskId = active.id.toString()
            const status = over.id as TaskStatus

            mutate({projectId, taskId, status})
            //usamos setQueryData --> en lugar de esperar a que se invaliden los queries en onSucces, lo hacemos manualmente antes.
            queryClient.setQueryData(["detailProyect"], (prevData: Project) => {
                const updatedTask = prevData.tasks.map((task) => {
                    if (task._id === taskId) {
                        return {
                            ...task,
                            status
                        }
                    } return task
                })
                return {
                    ...prevData,
                    tasks: updatedTask
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div
                            key={status}
                            className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'
                        >
                            <h3
                                className={`capitalize border border-slate-300 text-xl font-light bg-white p-3 border-t-8 ${statusColors[status]}`}
                            >
                                {statusTranslate[status]}
                            </h3>
                            <DropTask status={status}/>
                            <ul
                                className='mt-5 space-y-5'
                            >{tasks.length === 0 ? (
                                <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                            ) : (
                                tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                            )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>



        </>
    )
}

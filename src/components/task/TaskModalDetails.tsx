import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskAPI';
import { formatDate } from '@/utils/utils';
import { statusTranslate } from '@/locales/es';
import { toast } from 'react-toastify';
import { TaskStatus } from '@/types/index';
import NotesPanel from '../notes/NotesPanel';

export default function TaskModalDetails() {

    //ESTE CODIGO DETERMINA SI SE MUESTRA O NO EL MODAL
    const navigate = useNavigate()
    //accedemos al location para obtener el searchParams
    const location = useLocation()
    //devuelve un nro de searchParams
    const searchParams = new URLSearchParams(location.search)
    //devuelve true o null
    const taskId = searchParams.get('viewTask')!
    const showModal = taskId ? true : false

    //obtenemos el projectId
    const params = useParams()
    const projectId = params.projectId!

    //instanciamos useQueryClient
    const queryClient = useQueryClient()

    //USE QUERY --> accedemos a los datos de la tarea --> enabled se ejecuta solo si es TRUE
    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId,
        retry: false
    })
    //USE MUTATION --> actualizamos los estados de las tareas
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["detailProyect"]})
            queryClient.invalidateQueries({queryKey: ["task", taskId]})
            toast.success(data)
            
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus
        const data = { projectId, taskId, status}
        mutate(data)
    }
    
    if (isError) return <Navigate to='/404' />
    if (data) return (
        <>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el: { formatDate(data.createdAt) }</p>
                                    <p className='text-sm text-slate-400'>Última actualización: { formatDate(data.updatedAt) }</p>
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.taskName}
                                    </Dialog.Title>
                                    <p className='text-lg text-slate-700 mb-2'>{data.description}</p>
                                    {data.completedBy.length ? (
                                        <>
                                            <p className='font-bold text-2xl text-slate-600 my-5'>Historial de cambios:</p>
                                            <ul className=' list-decimal'>
                                                {data.completedBy.map((activityLog) => (
                                                    <li
                                                    key={activityLog._id}>
                                                        <span>
                                                            {statusTranslate[activityLog.status]}
                                                        </span>{" "} por: {activityLog.user.userName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ): null}
                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:</label>

                                        <select
                                            className='w-full p-1 bg-white border border-gray-300'
                                            defaultValue={data.status}
                                            onChange={handleChange}
                                        >
                                            {Object.entries(statusTranslate).map(([key, value]) => (
                                                <option
                                                    key={key}
                                                    value={key}
                                                >
                                                {value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <NotesPanel notes={data.notes}/>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
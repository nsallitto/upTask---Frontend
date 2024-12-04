import { Fragment } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, Transition } from '@headlessui/react';
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

export default function AddTaskModal() {

    //ESTE CODIGO DETERMINA SI SE MUESTRA O NO EL MODAL
    const navigate = useNavigate()
    //accedemos al location para obtener el searchParams
    const location = useLocation()
    //devuelve un nro de searchParams
    const searchParams = new URLSearchParams(location.search)
    //devuelve true o null
    const modalTask = searchParams.get('newTask')
    const showModal = modalTask ? true : false


    //obtenemos el projectId
    const params = useParams()
    const projectId = params.projectId!

    //REACT HOOK FORM
    const initialValues: TaskFormData = {
        taskName: "",
        description: ""
    }
    const {register, handleSubmit, reset, formState: { errors } } = useForm( {defaultValues: initialValues} )

    //REACT QUERY
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)
            reset()
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey: ['detailProyect']})
            navigate(location.pathname)
        }
    })
    const handleCreateTask = (formData: TaskFormData) => {        
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
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
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Llena el formulario y crea una  {''}
                                        <span className="text-fuchsia-600">nueva tarea</span>
                                    </p>

                                    <form
                                        className="mt-10 rounded-lg shadow-lg p-10 bg-gray-50 space-y-8"
                                        noValidate
                                        onSubmit={handleSubmit(handleCreateTask)}
                                    >

                                        <TaskForm 
                                            errors={errors}
                                            register={register}
                                        />

                                        <input
                                            className="bg-fuchsia-700 hover:bg-fuchsia-800 w-full p-3 text-white uppercase font-bold rounded cursor-pointer transition-colors"
                                            value="Crear Tarea"
                                            type="submit"
                                        />

                                    </form>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
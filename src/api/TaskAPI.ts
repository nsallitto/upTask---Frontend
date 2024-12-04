import api from "@/lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";
import { isAxiosError } from "axios";

type TaskAPIType = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
    status: Task['status']
}
//CREAR TREA
export async function createTask({ formData, projectId } : Pick<TaskAPIType, 'formData'|'projectId'>) {
    try {
        const url = `/projects/${projectId}/task`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//OBTENER TAREA
export async function getTaskById({ projectId, taskId } : Pick<TaskAPIType, 'projectId'|'taskId'>) {
    try {
        const url = `/projects/${projectId}/task/${taskId}`
        const { data } = await api(url)
        const response = taskSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//EDITAR TAREA
export async function updateTask ({ projectId, taskId, formData }: Pick<TaskAPIType, 'projectId'|'taskId'|'formData'>) {
    try {
        const url = `/projects/${projectId}/task/${taskId}`
        const { data } = await api.put<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//ELIMINAR TAREA
export async function deleteTask ({ projectId, taskId }: Pick<TaskAPIType, 'projectId'|'taskId'>) {
    try {
        const url = `/projects/${projectId}/task/${taskId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//EDITAR STATUS
export async function updateStatus ({ projectId, taskId, status } : Pick<TaskAPIType, 'projectId'|'taskId'|'status'>) {
    try {
        const url = `/projects/${projectId}/task/${taskId}/status`
        const { data } = await api.post(url, {status})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



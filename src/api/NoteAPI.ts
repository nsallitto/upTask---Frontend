import { isAxiosError } from "axios";
import { Note, NoteForm, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteAPIType = {
    formData: NoteForm,
    projectId: Project["_id"],
    taskId: Task["_id"]
    noteId: Note["_id"]
}

export async function createNote({ projectId, taskId, formData }: Pick<NoteAPIType, 'formData'|'projectId'|'taskId'>) {
    try {
        const url = `/projects/${projectId}/task/${taskId}/notes`
        const { data } = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({projectId, taskId, noteId}: Pick<NoteAPIType, 'projectId'|'taskId'|'noteId'>) {
    try {
        const url = `projects/${projectId}/task/${taskId}/notes/${noteId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
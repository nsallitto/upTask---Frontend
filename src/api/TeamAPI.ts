import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema, } from "../types";
import api from "@/lib/axios";

//BUSCA EL USUARIO QUE QUEREMOS AGREGAR
export async function findUserByEmail({ projectId, formData}:{projectId: Project["_id"], formData: TeamMemberForm}) {
    try {
        const url = `/projects/${projectId}/team/find`
        const { data } = await api.post(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//AGREGAR USUARIO AL PROYECTO POR ID
export async function AddMemberById({projectId, id}:{projectId: Project["_id"], id: TeamMember["_id"]} ) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api.post<string>(url, {id})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//MOSTRAMOS TODOS LOS COLABORADORES DEL PROYECTO
export async function getProjectTeam(projectId: Project["_id"]) {
    try {
        const url = `/projects/${projectId}/team`
        const { data } = await api(url)
        const response = teamMembersSchema.safeParse(data)
        if (response.success) {
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
//ELIMINAMOS UN COLABORADOR DE UN PROYECTO
export async function deleteUserFromProject({projectId, userId}:{projectId: Project["_id"], userId: TeamMember["_id"]}) {
    try {
        const url = `/projects/${projectId}/team/${userId}`
        const { data } = await api.delete<string>(url)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
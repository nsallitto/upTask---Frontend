import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProject } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {

    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProject(projectId),
        retry: false,
    })

    if(isLoading) return "Cargando..."
    if(isError) return <Navigate to='/404' />
    if(data) return <EditProjectForm data={data} projectId={projectId}/>
}

import { AddMemberById } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type MemberSearchResultProps = {
    user: TeamMember
    reset: () => void
}
export default function MemberSearchResult({ user, reset }: MemberSearchResultProps) {

    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: AddMemberById,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey:["projectTeam", projectId]})

        }
    })

    const handleAddMember = () => {
        const data = { 
            projectId, 
            id: user._id
        }
        mutate(data)
    }
    
    return (
        <>
            <p className="text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center mt-5">
                <p className="">Usuario: <span className="font-bold">{user.userName}</span></p>
                <button
                    onClick={handleAddMember}
                    className="p-2 bg-purple-400 hover:bg-purple-600 text-white transition-all cursor-pointer"
                >Agregar al Proyecto</button>
            </div>
        </>
    )
}

import { useDroppable } from "@dnd-kit/core"

type DropTaskProps = {
    status: string
}

export default function DropTask({status}: DropTaskProps) {

    const { setNodeRef, isOver } = useDroppable({
        id: status
    })

    const style = {
        opacity: isOver ? 0.4 : undefined
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border border-dashed border-slate-500 text-slate-500 text-center text-xs font-semibold uppercase p-1 mt-5 grid place-content-center"
        >
            Soltar tarea aquí
        </div>
    )
}

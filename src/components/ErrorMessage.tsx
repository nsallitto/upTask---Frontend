
export default function ErrorMessage({children} : {children: React.ReactNode}) {
    return (
        <div className="text-center my-4 bg-red-200 text-red-600 p-3 font-bold uppercase text-sm">
            {children}
        </div>
    )
}

import { deleteKnot } from "@/lib/actions/knot.action"
import { redirect } from "next/navigation"

const page = async ({params}:{params:{id:string}}) => {
    if(!params.id) redirect("/")
    await deleteKnot(params.id)
    redirect('/')
}

export default page

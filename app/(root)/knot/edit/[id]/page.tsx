import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser } from "@/lib/actions/user.action";
import EditKnot from "@/components/forms/editKnot";

async function Page({params}:{params:{id:string}}){
    if(!params.id) redirect("/")
        // console.log(params.id)
    const user=await currentUser()

    if(!user) redirect("/sign-in");

    let isOnboarded=false;

    const userInfo = await fetchUser(user.id)

    if(userInfo){ 
        isOnboarded=true;
    }

    return (
        <>
           <h1 className="head-text">Edit Your Knot</h1>

           <EditKnot id={params.id}/>
        </>
    )
}

export default Page;
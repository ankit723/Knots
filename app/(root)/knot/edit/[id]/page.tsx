import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser } from "@/lib/actions/user.action";
import EditKnot from "@/components/forms/editKnot";
import { fetchKnotById } from "@/lib/actions/knot.action";

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

    const post=await fetchKnotById(params.id)

    return (
        <>
           <h1 className="head-text">Edit Your Knot</h1>

           <EditKnot id={params.id} text={post.text} image={post.imageUrl}/>
        </>
    )
}

export default Page;
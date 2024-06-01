import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser } from "@/lib/actions/user.action";
import PostKnot from "@/components/forms/postKnot";

async function Page(){
    const user=await currentUser()

    if(!user) return null;

    const userInfo = await fetchUser(user.id)

    if(!userInfo.onboarded) redirect('/onboarding')

    return (
        <>
           <h1 className="head-text">Tie new Knot</h1>

           <PostKnot userId={userInfo._id}/>
        </>
    )
}

export default Page;
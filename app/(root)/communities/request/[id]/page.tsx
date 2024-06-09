import { addMemberRequestToCommunity } from '@/lib/actions/community.action'
import { fetchUser } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const page = async({params}:{params:{id:string}}) => {
    const user= await currentUser()
    const userInfo= await fetchUser(user?.id || "")
    console.log(userInfo._id)

    const community= await addMemberRequestToCommunity(params.id, userInfo.id)
    if(!community)return "We got some issue to get you request to the other end"

    redirect(`/communities/${params.id}`)
}

export default page

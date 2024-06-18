import { addMemberRequestToCommunity, removeUserFromCommunity } from '@/lib/actions/community.action'
import { fetchUser } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const page = async({params}:{params:{id:string}}) => {
    const user= await currentUser()
    const userInfo= await fetchUser(user?.id || "")

    if(!user) redirect('/sign-in')

    const community= await removeUserFromCommunity(userInfo.id, params.id)
    if(!community)return "We got some issue to get you request to the other end"

    redirect(`/communities/${params.id}`)
}

export default page

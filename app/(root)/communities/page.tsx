
import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/profileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import KnotsTab from "@/components/shared/knotsTab";
import UserCard from "@/components/cards/userCard";
import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "@/components/cards/CommunityCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function Page(){

  const user=await currentUser()

  const result =await fetchCommunities({
    searchString:"",
    pageNumber:1,
    pageSize:25
  })

  return (
    <section>
      <div className="flex justify-between items-center mb-10">
        <h1 className="head-text">All Communities</h1>
        {user?(<Link href={`/communities/create/${user?.id}`}><Button size='sm' className='community-card_btn'>Create Community</Button></Link>):""}
      </div>


        <div className="mt-14 flex flex-wrap gap-9">
          {result.communities.length===0?(
            <p className="no-result">No Communities to Show</p>
          ):(
            <>
              {result.communities.map((community)=>(
                <CommunityCard 
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              ))}
            </>
          )}
        </div>
    </section>
  )
}

export default Page
 
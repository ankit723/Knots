
import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/profileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import KnotsTab from "@/components/shared/knotsTab";
import UserCard from "@/components/cards/userCard";

async function Page({params}:{params:{id:string}}){

  const user=await currentUser()

  const result =await fetchUsers({
    userId:user?.id || "",
    searchString:"",
    pageNumber:1,
    pageSize:25
  })

  console.log("all users are",result)

  return (
    <section>
        <h1 className="head-text mb-10">Search</h1>


        <div className="mt-14 flex flex-col gap-9">
          {result.users.length===0?(
            <p className="no-result">No Users</p>
          ):(
            <>
              {result.users.map((person)=>(
                <UserCard 
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              ))}
            </>
          )}
        </div>
    </section>
  )
}

export default Page
 
import { fetchCommunities } from '@/lib/actions/community.action'
import React from 'react'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { fetchUsers } from '@/lib/actions/user.action'
import { currentUser } from '@clerk/nextjs/server'

const Rightsidebar = async() => {
  const user= await currentUser()
  const result = await fetchCommunities({searchString:"",pageNumber:1,pageSize:25}) 
  const rightUsers =await fetchUsers({userId:user?.id || "",searchString:"",pageNumber:1,pageSize:25})
  console.log(result.communities) 
  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-light-1 font-extrabold'>Suggested Communities</h3>

        {result.communities.slice(0, 5).map((community:any)=>(
          <>
            <div key={community.id} className="flex cursor-pointer justify-between my-5">
              <figure className='flex items-center gap-2'>
                  <Image src={community.image} alt='podcaster-name' width={44} height={44} className='aspect-square rounded-full'/>
                  <h2 className=' font-semibold text-white-1'>{community.name} <br /> <span className=' text-white-3 text-tiny-medium'>{community.username}</span></h2>
              </figure>
              <div className="flex items-center">
                  <Button className="bg-orange-1 font-normal text-white-1">
                      <Link href={`/communities/${community.id}`}>View</Link>
                  </Button>
              </div>
            </div>
          </>
        ))}

      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className='text-light-1 font-extrabold'>Suggested Users</h3>

        {rightUsers.users.slice(0, 5).map((community:any)=>(
          <>
            <div key={community.id} className="flex cursor-pointer justify-between my-5">
              <figure className='flex items-center gap-2'>
                  <Image src={community.image} alt='podcaster-name' width={44} height={44} className='aspect-square rounded-full'/>
                  <h2 className=' font-semibold text-white-1'>{community.name} <br /> <span className=' text-white-3 text-tiny-medium'>{community.username}</span></h2>
              </figure>
              <div className="flex items-center">
                  <Button className="bg-orange-1 font-normal text-white-1">
                      <Link href={`/profile/${community.id}`}>View</Link>
                  </Button>
              </div>
            </div>
          </>
        ))}
      </div>
    </section>
  )
}

export default Rightsidebar

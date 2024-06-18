"use client"
import React from 'react'
import { cn } from '@/lib/utils'
import {sidebarLinks} from '@/constants'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs'


const Leftsidebar = () => {
  const router =useRouter()
  const pathname=usePathname()
  const {userId}=useAuth()

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className="flex w-full flex-1 flex-col gap-6">
      {sidebarLinks.map(({route, label, imgURL})=>{
          const isActive = pathname===route || route.startsWith(`${route}/`)
          if(route==='/profile')route=`${route}/${userId}`
          return(
            <Link href={route} key={label} className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {'bg-nav-focus border-r-4 border-orange-1':isActive})}>
              <Image src={imgURL} alt={label} width={24} height={24}/>
              <p>{label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton>
              <div className="flex cursor-pointer gap-4 p-4" onClick={()=>router.push('/sign-in')}>
                  <Image src='/assets/logout.svg' alt="logout image" width={24} height={24} />
                  <p className='text-light-2 font-extrabold max-lg:hidden'>Logout</p>
              </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default Leftsidebar

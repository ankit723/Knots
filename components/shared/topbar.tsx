import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { OrganizationSwitcher, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { fetchUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'

const Topbar = async () => {
    const user = await currentUser()
    const userInfo = await fetchUser(user?.id || "")
    return (
        <nav className='topbar'>
            <Link href='/' className='flex items-center gap-4'>
                <Image src='/assets/logo.png' alt='logo' width={28} height={28} />
                <p className='text-heading3-bold font-extrabold text-light-1 max-xs:hidden'>Knots</p>
            </Link>

            <div className="flex items-center gap-1 ">
                <SignedOut>
                    <Link href={"/sign-in"} className='text-black-3 bg-white px-5 py-2 rounded-lg font-extrabold w-full bg-orange-1'>Sign In</Link>
                </SignedOut>
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer ">
                                <Image src='/assets/logout.svg' alt="logout image" width={24} height={24} />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>

                {user?(<Link href={'/profile/edit'}>
                    <div className=" bg-[#ffffff08] px-6 rounded-lg py-1 flex items-center justify-center gap-3">
                        <Image
                            src={userInfo?.image||user?.imageUrl}
                            alt="logo"
                            width={35}
                            height={35}
                            className='rounded-full'
                        />

                        <div className="flex-1 text-ellipsis">
                            <h4 className='text-small-semibold text-light-1 font-extrabold'>{userInfo?.name||user?.firstName}</h4>
                            <p className="text-small-medium text-gray-1">@{userInfo?.username || user?.username}</p>
                        </div>

                        <Image
                            src="/assets/edit.svg"
                            alt="logo"
                            width={20}
                            height={20}
                        />
                    </div>
                </Link>):""}

            </div>
        </nav>
    )
}

export default Topbar

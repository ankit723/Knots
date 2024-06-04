import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { OrganizationSwitcher, SignOutButton, SignedIn, SignedOut } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Topbar = () => {
  return (
    <nav className='topbar'>
        <Link href='/' className='flex items-center gap-4'>
            <Image src='/assets/logo.svg' alt='logo' width={28} height={28}/>
            <p className='text-heading3-bold text-light-1 max-xs:hidden'>Knots</p>
        </Link>

        <div className="flex items-center gap-1 ">
            <SignedOut>
                <Link href={"/sign-in"} className='text-heading5-bold text-dark-3 bg-white px-5 py-2 rounded-lg'>Sign In</Link>
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

            <OrganizationSwitcher 
                appearance={{
                    baseTheme:dark,
                    elements:{
                        organizationSwitcherTrigger:"py-2 px-4"
                    }
                }}
            />
        </div>
    </nav>
  )
}

export default Topbar

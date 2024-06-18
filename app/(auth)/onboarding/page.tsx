import AccountProfile from "@/components/forms/accountProfile";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import {redirect} from 'next/navigation'
import Link from "next/link";

async function Page(){
    const user =await currentUser()
    if(!user) redirect('sign-in')

    const userInfo = await fetchUser(user.id)
    
    if(userInfo) redirect('/')

    const userData={
        id:user.id,
        username:user.username,
        name: user.firstName,
        bio:"",
        image:user.imageUrl,
    }

    return(
        <main className="mx-auto flex max-w-3x] flex-col justify-start px-10 py-10">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">Complete your profile now to use Knots</p>

            <section className="mt-9 bg-dark-2 p-10 ">
                <AccountProfile user={userData} btnTitle={"Continue"}/>
                <div className="w-full flex justify-center items-center my-10">
                    <Link href={'/'} className='text-heading5-bold text-[#7f7f7f] px-5 py-2 rounded-lg'>
                        Skip for now
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Page;
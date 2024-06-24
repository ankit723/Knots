'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useClerk, useUser } from '@clerk/nextjs'
import { addPodcraftrId, fetchUser, fetchUserPodcastId, isUserOnboarded } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation'


const Page = () => {
    const [input, setInput] = useState("")
    const [userInfo, setUserInfo] = useState(false)
    const router =useRouter()
    const {user}=useClerk()
    if(!user)redirect('/sign-in')
        
    useEffect(()=>{
        async function getUserInfo(){
            const is=await isUserOnboarded(user?.id||"")
            if(!is){
                redirect('/onboarding')
            }
        }

        async function checkPodcastId(){
            const is=await fetchUserPodcastId(user?.id||"")
            if(is){
                router.push(`/connect-app/podcraftr/${is}`)
            }
        }
        checkPodcastId()
        getUserInfo()
    }, [])


    const addPodcraftrIdToProfile = async() => {
        // Implement the function to handle adding the Podcraftr ID
        console.log(user?.id, input)
        await addPodcraftrId(user?.id||"", input)
        alert("Podcraftr Account Created! ")
    }

    return (
        <div>
            <div className="flex gap-3 items-center mt-10 justify-center">
                <h1 className="head-text">Welcome, To the connection page of the</h1>
                <Link href='https://podcraftr.vercel.app' target='_blank'>
                    <Image src="/assets/podcraftr.svg" width={30} height={30} alt="podcraftr" />
                </Link>
                <h1 className="head-text">Podcraftr</h1>
            </div>

            <div className="w-full flex justify-center items-center mt-40">
                <div className="bg-black-5 flex flex-col justify-center items-center p-10 pt-4 rounded-lg ">
                    <p className="text-white-1 mt-4">Copy the userId from your podcastr profile and paste it here!</p>
                    <input 
                        value={input} 
                        type="text" 
                        placeholder='User Id: ' 
                        className="mt-1 text-white-1 block w-full px-3 py-2 bg-black-3 mb-3 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-orange-1 focus:ring-1 focus:ring-orange-1" 
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <h1 
                        className="text-white-1 font-bold bg-orange-1 px-5 py-2 rounded-lg cursor-pointer" 
                        onClick={addPodcraftrIdToProfile}
                    >
                        Connect With Podcraftr
                    </h1>
                    <h1 className="text-white-1 p-5 rounded-lg text-center">
                        don't have an account <Link href="https://podcraftr.vercel.app/sign-up" className='text-white-1 font-bold bg-orange-1 p-2 rounded-lg mt-3'>Create One Now!</Link>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Page

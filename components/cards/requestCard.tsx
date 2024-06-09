'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { redirect, useRouter } from 'next/navigation'
import { addMemberToCommunity } from '@/lib/actions/community.action'


interface Props{
    id: string,
    name:string
    username:string
    imgUrl:string
    personType:string,
    communityId:string
}

const RequestCard = ({id, name, username, imgUrl, personType, communityId}:Props) => {

    const handleAccept=async()=>{
        const community=await addMemberToCommunity(communityId, id)
        window.location.reload()
    }

  return (
    <article className="user-card">
        <div className="user-card_avatar">
            <Image
                src={imgUrl}
                alt="logo"
                width={48}
                height={48}
                className='rounded-full'
            />
            
            <div className="flex-1 text-ellipsis">
                <h4 className='text-base-semibold text-light-1'>{name}</h4>
                <p className="text-small-medium text-gray-1">@{username}</p>
            </div>
        </div>

        <Button className='user-card_btn' onClick={()=> handleAccept()}>Accept</Button>

    </article>
  )
}

export default RequestCard

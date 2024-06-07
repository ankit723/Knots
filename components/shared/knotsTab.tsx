import { fetchUserPosts } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'
import KnotCard from '../cards/knotCard'
import { fetchCommunityPosts } from '@/lib/actions/community.action'

interface Props{
    currentUserId:string,
    accountId:string,
    accountType:string
}

const KnotsTab = async({currentUserId, accountId, accountType}:Props) => {
    let result:any;

    if(accountType==='Community'){
        result = await fetchCommunityPosts(accountId)
    }else{
        result = await fetchUserPosts(accountId)
    }

    console.log("buubvibib", result.knots)

    if(!result) redirect('/')

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.knots.map((knot:any)=>(
                <KnotCard 
                    key={knot._id}
                    id={knot._id}
                    currentUserId={currentUserId}
                    parentId={knot.parentId}
                    content={knot.text}
                    author={
                        accountType === 'User'
                        ? {username:result.username, image:result.image, id:result.id}
                        : {username:knot.author.username, image:knot.author.image, id:knot.author.id }}
                    community={knot.community}
                    createdAt={knot.createdAt}
                    comments={knot.childrens}
                />
            ))}
        </section>
    )
}

export default KnotsTab

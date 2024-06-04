import { fetchUserPosts } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'
import KnotCard from '../cards/knotCard'

interface Props{
    currentUserId:string,
    accountId:string,
    accountType:string
}

const KnotsTab = async({currentUserId, accountId, accountType}:Props) => {

    let result = await fetchUserPosts(accountId)
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
                        ? {name:result.name, image:result.image, id:result.id}
                        : {name:thread.author.name, image:knot.author.image, id:knot.author.id }}
                    community={knot.community}
                    createdAt={knot.createdAt}
                    comments={knot.childrens}
                />
            ))}
        </section>
    )
}

export default KnotsTab

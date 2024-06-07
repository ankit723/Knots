import React, {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns';

interface Props{
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string
    author: {
        username:string,
        image:string,
        id:string
    },
    community: {
        id:string,
        name:string,
        image:string,
    } | null,
    createdAt: string,
    comments: {
        author: {
            image: string
        }
    }[]
    isComment?:boolean
}

const KnotCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment
}:Props) => {

    const formattedDate = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <article className={`flex w-full flex-col ${isComment?'px-0 xs:px-7':'rounded-xl bg-dark-2 p-7'}`}>
        <div className="flex items-start justify-between">
            <div className="flex w-full flex-1 flex-row gap-4">
                <div className="flex flex-col items-center">
                    <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
                        <Image src={author.image} alt='profile image' fill className='cursor-pointer rounded-full'/>
                    </Link>
                    <div className="thread-card_bar" />
                </div>
                <div className="flex w-full flex-col">
                    <Link href={`/profile/${author.id}`} className='w-fit'>
                        <h4 className='cursor-pointer text-base-semibold text-light-1'>{author.username}</h4>
                    </Link>

                    <Link className='mt-2 text-small-regular text-light-2 cursor-pointer' href={`/knot/${id}`}>{content}</Link>

                    <div className="mt-5 flex flex-col gap-3 justify-center">
                        <div className="flex justify-center md:justify-between items-center gap-10 md:gap-0">
                            <div className="flex gap-3.5">
                                <Image src='/assets/heart-gray.svg' alt='heart' width={24} height={24} className='cursor-pointer object-contain'/>
                                    <Image src='/assets/reply.svg' alt='reply' width={24} height={24} className='cursor-pointer object-contain'/>
                                <Image src='/assets/repost.svg' alt='repost' width={24} height={24} className='cursor-pointer object-contain'/>
                                <Image src='/assets/share.svg' alt='share' width={24} height={24} className='cursor-pointer object-contain'/>
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-between">
                                <Link className='mt-2 text-subtle-medium text-gray-1 cursor-pointer' href={`/knot/${id}`}>{formattedDate}- &nbsp;</Link>
                                <div className="">
                                    {!isComment && community && (
                                        <Link className='mt-2 text-subtle-medium text-gray-1 cursor-pointer flex' href={`/communities/${community.id}`}>
                                            <p>{community.name} Community</p>
                                            <Image src={community.image} alt={community.name} width={14} height={14} className='cursor-pointer object-contain rounded-full ml-2'/>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        {isComment && comments.length > 0 && (
                            <>
                                <p className='mt-1 text-subtle-medium text-gray-1'>
                                    <Link href={`/knot/${id}`}>{comments.length} replies</Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </article>
  )
}

export default KnotCard

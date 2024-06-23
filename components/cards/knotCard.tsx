import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    image:string | null,
    author: {
        username: string,
        image: string,
        id: string
    },
    likes: {
        username: string,
        image: string,
        id: string
    }[],
    community: {
        id: string,
        name: string,
        image: string,
    } | null,
    createdAt: string,
    comments: {
        author: {
            image: string
        }
    }[],
    isComment?: boolean
}

const KnotCard = ({
    id,
    currentUserId,
    parentId,
    content,
    image,
    author,
    likes,
    community,
    createdAt,
    comments,
    isComment
}: Props) => {
    const formattedDate = new Date(createdAt).toLocaleString();

    const isLiked = likes.some((u) => u.id === currentUserId);

    // Function to convert URLs in content to clickable links
    const convertToLinks = (text: string) => {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlPattern, (url) => {
            return `<a href="${url}" target="_self" class=" text-primary-500 break-words">Link to the Page</a>`;
        });
    };

    return (
        <article className={`flex w-full flex-col ${isComment ? 'px-0 xs:px-7' : 'rounded-xl bg-[#23232729] p-7'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
                            <Image src={author.image} alt='profile image' fill className='cursor-pointer rounded-full' />
                        </Link>
                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>{author.username}</h4>
                        </Link>

                        <div className='mt-2 text-small-regular text-light-2 cursor-pointer break-words' dangerouslySetInnerHTML={{ __html: convertToLinks(content) }}></div>

                        <div className="flex justify-center items-center w-full h-full mt-5 p-5">
                            {image?<Image src={image} width={600} height={600} alt="Post Image" quality={100} className='w-full h-full '/>:""}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 justify-center">
                            <div className="flex justify-center md:justify-between items-center gap-10 md:gap-0">
                                <div className="flex gap-3.5">
                                    <Link href={`/knot/like/${id}`}>
                                        <Image src={likes?isLiked?'/assets/heart-filled.svg':"/assets/heart-gray.svg":"assets/heart-gray.svg"} alt='heart' width={24} height={24} className='cursor-pointer object-contain' />
                                    </Link>
                                    <Link href={`/knot/${id}`}>
                                        <Image src='/assets/reply.svg' alt='reply' width={24} height={24} className='cursor-pointer object-contain' />
                                    </Link>
                                </div>

                                <div className="flex flex-col md:flex-row justify-center items-between">
                                    <Link className='mt-2 text-subtle-medium text-gray-1 cursor-pointer' href={`/knot/${id}`}>
                                        {formattedDate} - &nbsp;
                                    </Link>
                                    <div className="">
                                        {!isComment && community && (
                                            <Link className='mt-2 text-subtle-medium text-gray-1 cursor-pointer flex' href={`/communities/${community.id}`}>
                                                <p className="truncate">{community.name} Community</p>
                                                <Image src={community.image} alt={community.name} width={14} height={14} className='cursor-pointer object-contain rounded-full ml-2' />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {isComment && comments.length > 0 && (
                                <p className='mt-1 text-subtle-medium text-gray-1'>
                                    <Link href={`/knot/${id}`}>{comments.length} replies</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {currentUserId===author.id?(
                    <div className="flex gap-2.5">
                        <Link href={`/knot/edit/${id}`}><Image src="/assets/edit.svg" alt="edit" width={17} height={17} className='cursor-pointer'/></Link>
                        <Link href={`/knot/delete/${id}`}><Image src="/assets/delete.svg" alt="edit" width={17} height={17} className='cursor-pointer'/></Link>
                    </div>
                ):""}
            </div>
        </article>
    );
}

export default KnotCard;

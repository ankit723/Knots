import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import Link from "next/link";

interface Props {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    type?: "User" | "Community";
}

const ProfileHeader = async ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type,
}: Props) => {
    const user = await currentUser();
    const userInfo = await fetchUser(user?.id || "");

    let communityDetails: any;

    if (type === "Community") {
        communityDetails = await fetchCommunityDetails(accountId);
    }

    const members=communityDetails?.members.map((mem:any)=>mem.id)
    const requests=communityDetails?.requests.map((req:any)=>req.id)

    return (
        <div className="flex flex-col justify-start w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image
                            src={imgUrl}
                            alt="profile photo"
                            fill
                            className="rounded-full object-cover shadow-2xl"
                        />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-left text-heading3-bold text-light-1">
                            {name}
                        </h1>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                    </div>

                    {type==='Community'?(
                        <>
                        {accountId.includes(authUserId)?
                            <Link href={`/communities/edit/${communityDetails.id}`} className="relative h-5 w-5 object-cover">
                                <Image
                                    src="/assets/edit.svg"
                                    alt="profile photo"
                                    fill
                                    className="object-cover shadow-2xl"
                                />
                            </Link>:
                            members.includes(user?.id) || requests.includes(user?.id)?(
                                <Link href={`/communities/unFollow/${accountId}`} className="relative h-5 w-5 object-cover">
                                    <Image
                                        src="/assets/logout.svg"
                                        alt="profile photo"
                                        fill
                                        className="object-cover shadow-2xl cursor-pointer"
                                    />
                                </Link>
                            ):""
                        }
                        </>
                    ):(
                        <>
                        {accountId===authUserId?
                            <Link href={`/profile/edit/`} className="relative h-5 w-5 object-cover">
                                <Image
                                    src="/assets/edit.svg"
                                    alt="profile photo"
                                    fill
                                    className="object-cover shadow-2xl"
                                />
                            </Link>:""
                        }
                        </>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center mt-6">
                <p className="max-w-lg text-base-regular text-light-2">{bio}</p>
                {type === "Community" &&
                    communityDetails.createdBy?.id !== user?.id &&
                    !members.includes(user?.id) ? (
                        requests.includes(user?.id) ? (
                        <Button size="sm" className="community-card_btn">
                            Requested
                        </Button>
                    ) : (
                        <Button size="sm" className="community-card_btn">
                            <Link href={`/communities/request/${accountId}`}>
                                Follow
                            </Link>
                        </Button>
                    )
                ) : (
                    ""
                )}
            </div>

            <div className="mt-12 h-0.5 w-full bg-dark-3"></div>
        </div>
    );
};

export default ProfileHeader;

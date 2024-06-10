import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/profileHeader";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { communityTabs } from "@/constants";
import KnotsTab from "@/components/shared/knotsTab";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import UserCard from "@/components/cards/userCard";
import RequestCard from "@/components/cards/requestCard";
import PostKnot from "@/components/forms/postKnot";
import { use } from "react";

async function Page({params}:{params:{id:string}}){
    const user=await currentUser()

    let isOnboarded=false;

    const userInfo = await fetchUser(user?.id||"")

    if(userInfo){ 
        isOnboarded=true;
    }
    const communityDetails=await fetchCommunityDetails(params.id)

    return (
        <section>
            <ProfileHeader 
                accountId={communityDetails.id}
                authUserId={user?.id||""}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />

            <div className="mt-9">
                <Tabs defaultValue="knots" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab)=>(
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image 
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain "
                                />

                                <p className="max-sm:hidden">{tab.label}</p>

                                {tab.label==='Knots'&&(
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {communityDetails?.knots?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="knots" className="w-full text-light-1">
                        <KnotsTab 
                            currentUserId={user?.id || ""}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>

                    <TabsContent value="members" className="w-full text-light-1">
                        <section className="mt-9 flex flex-col gap-10">
                            {communityDetails?.members.map((member:any)=>(
                                <UserCard 
                                    key={member.id}
                                    id={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType="User"
                                />
                            ))}
                        </section>
                    </TabsContent>

                    <TabsContent value="requests" className="w-full text-light-1">
                        {communityDetails.createdBy?.id===user?.id?
                            (<section className="mt-9 flex flex-col gap-10">
                                {communityDetails?.requests.map((member:any)=>(
                                    <RequestCard 
                                        key={member.id}
                                        id={member.id}
                                        name={member.name}
                                        username={member.username}
                                        imgUrl={member.image}
                                        personType="Community"
                                        communityId={communityDetails.id}
                                    />
                                ))}
                            </section>
                            ):""
                        }
                    </TabsContent>

                    <TabsContent value="postKnot" className="w-full text-light-1">
                        <PostKnot userId={userInfo?._id} isOnboarded={true} organization={communityDetails.id}/>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default Page;
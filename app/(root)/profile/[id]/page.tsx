import { currentUser } from "@clerk/nextjs/server"
import {redirect} from 'next/navigation'
import { fetchUser } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/profileHeader";
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { profileTabs } from "@/constants";
import Image from "next/image";
import KnotsTab from "@/components/shared/knotsTab";
import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "@/components/cards/CommunityCard";
import { communityChildTabs } from "@/constants";

async function Page({params}:{params:{id:string}}){
    const user=await currentUser()

    if(!user) redirect("/sign-in");

    const userInfo = await fetchUser(params.id)

    if(!userInfo) redirect('/onboarding')

    const result =await fetchCommunities({
        searchString:"",
        pageNumber:1,
        pageSize:25
        })

    return (
        <section>
            <ProfileHeader 
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="knots" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab)=>(
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
                                        {userInfo?.knots?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value={"knots"} className="w-full text-light-1">
                        <KnotsTab 
                            currentUserId={user.id}
                            accountId={userInfo.id}
                            accountType="User"
                        />
                    </TabsContent>

                    <TabsContent value={"communities"} className="text-light-1 mx-20 mt-5">

                        <Tabs defaultValue="createdCommunities" className="w-full">
                            <TabsList className="tab">
                                {communityChildTabs.map((tab)=>(
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
                                                {userInfo?.knots?.length}
                                            </p>
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value={"createdCommunities"} className="w-full text-light-1">
                                <div className="mt-14 flex flex-wrap gap-2">
                                    {result.communities.length===0?(
                                        <p className="no-result">No Communities to Show</p>
                                    ):(
                                        <>
                                        {result.communities.map((community)=>(
                                            <CommunityCard 
                                            key={community.id}
                                            id={community.id}
                                            name={community.name}
                                            username={community.username}
                                            imgUrl={community.image}
                                            bio={community.bio}
                                            members={community.members}
                                            />
                                        ))}
                                        </>
                                    )}
                                </div>
                            </TabsContent>

                        </Tabs>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

export default Page;
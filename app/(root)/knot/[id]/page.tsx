import React from "react";
import KnotCard from "@/components/cards/knotCard";
import { currentUser } from "@clerk/nextjs/server";
import { fetchUser } from "@/lib/actions/user.action";
import { fetchKnotById } from "@/lib/actions/knot.action";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/comment";
import Knot from "@/lib/models/knot.model";

const Page = async({ params }: { params: { id: string } }) => {
    if(!params.id) return null;

    const user=await currentUser()
    if(!user)return null;

    console.log(params.id)

    const userInfo=await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')

    const post=await fetchKnotById(params.id)




    return (
        <section className="relative">
            <div className="">
                <KnotCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                />
            </div>

            <div className="mt-7">
                <Comment 
                    postId={post.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {
                    post.children.map((childItem: any)=>(
                        <KnotCard
                            key={childItem._id}
                            id={childItem._id}
                            currentUserId={user?.id || ""}
                            parentId={childItem.parentId}
                            content={childItem.text}
                            author={childItem.author}
                            community={childItem.community}
                            createdAt={childItem.createdAt}
                            comments={childItem.children}
                            isComment={true}
                        />
                    ))
                }
            </div>
        </section>
    );
};

export default Page;

"use server";

import { revalidatePath } from "next/cache";
import Knot from "../models/knot.model";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose";

interface Params {
    text:string,
    author:string,
    communityId:string | null,
    path:string,
}

export async function createKnot({text, author, communityId, path}: Params): Promise<void> {
    try {
        connectedToDB();

        const createdKnot=await Knot.create({
            text,
            author,
            communityId:null,
        })

        await User.findByIdAndUpdate(author, {
            $push:{knots:createdKnot._id}
        })

        revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to tie a new knot: ${error.message}`);
    }
}

export async function fetchKnots(pageNumber=1, pageSize=20){
    try {

        connectedToDB();

        const skipAmount=(pageNumber-1)*pageSize

        const postQuery=Knot.find({parentId: {$in:[null, undefined]}})
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path:'author', model:User})
        .populate({
            path:"children",
            populate:{
                path:'author',
                model:User,
                select: "_id name parentId image"
            }
        })

        const totalPostCount=await Knot.countDocuments({parentId: {$in:[null, undefined]}})
        const posts=await postQuery.exec();

        const isNext=totalPostCount > skipAmount+posts.length;

        return {posts, isNext};

        
    }catch (error: any) {
        throw new Error(`Failed to catch knots: ${error.message}`);
    }
}


export async function fetchKnotById(id:string){
    connectedToDB()

    try {
        const knot =await Knot.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id username image"
        })
        .populate({
            path: 'children',
            populate:[
                {
                    path: 'author',
                    model:User,
                    select: "_id id username parentId image"
                },
                {
                    path:"children",
                    model: Knot,
                    populate:{
                        path: 'author',
                        model: User,
                        select: "_id id username parentId image"
                    }
                }
            ]
        }).exec()

        return knot;
    }catch(error:any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}



export async function addCommentToKnot(knotId: string, commentText:string, userId:string, path:string){
    connectedToDB()

    try{
        const originalKnot=await Knot.findById(knotId)
        if(!originalKnot) throw new Error("Knot not found")

            const commentKnot=new Knot({
                text:commentText,
                author: userId,
                parentId: knotId,
                createdAt: new Date()
            })

            const savedCommentKnot=await commentKnot.save()

            originalKnot.children.push(savedCommentKnot._id)
            await originalKnot.save()

            revalidatePath(path)

    }catch(error:any){
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}
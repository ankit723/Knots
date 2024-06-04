"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose";
import Knot from "../models/knot.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    try {
      connectedToDB();
  
      await User.findOneAndUpdate(
        { id: userId },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },
        { upsert: true }
      );
  
      if (path === "/profile/edit") {
        revalidatePath(path);
      }
    } catch (error: any) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
}


export async function fetchUser(userId:string){
    try {
        connectedToDB()

        return await User.findOne({id:userId})
        // .populate({
        //     path:'communities',
        //     model:Communities
        // })
        
    }catch (error: any) {
        throw new Error(`Failed to fetch the user: ${error.message}`);
    }
}


export async function fetchUserPosts(userId:string){
  try {
    connectedToDB()

    const knots=User.findOne({id: userId})
    .populate({
      path:"knots",
      model:Knot,
      populate:{
        path:"author",
        model:User,
        select: "name image id"
      }
    })

    return knots;
  } catch (error:any) {
    throw new Error(`Failed to fetch Posts ${error.message}`)
  }
}
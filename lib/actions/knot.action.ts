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

"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Knot from "../models/knot.model";
import User from "../models/user.model";

import { connectedToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectedToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function isUserOnboarded(userId: string) {
  try {
    connectedToDB();

    const user=await User.findOne({ id: userId })
    if(user){
      return true
    }else{
      return false
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPodcastId(userId: string) {
  try {
    connectedToDB();

    const user=await User.findOne({ id: userId })
    if(user){
      return user.podcraftrId
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}


export async function fetchUserCommunities(userId:string){
  try {
    connectedToDB()

    return await User.findOne({id:userId}).populate({
      path:"communities",
      model:Community,
      populate:[
        {
          path:"members",
          model:User
        }
      ]
    })


  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

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

export async function fetchUserPosts(userId: string) {
  try {
    connectedToDB();

    const knots = await User.findOne({ id: userId }).populate({
      path: "knots",
      model: Knot,
      populate: [
        {
          path: "community",
          model: Community,
          select: "username id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "likes",
          model: User,
          select: "username id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Knot,
          populate: {
            path: "author",
            model: User,
            select: "username image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return knots;
  } catch (error) {
    console.error("Error fetching user knots:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectedToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectedToDB();

    const userKnots = await Knot.find({ author: userId });

    const childKnotIds = userKnots.reduce((acc, userKnot) => {
      return acc.concat(userKnot.children);
    }, []);

    const replies = await Knot.find({
      _id: { $in: childKnotIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "username image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

export async function addPodcraftrId(userId:string, podcraftrId:string): Promise<void> {
  try {
    connectedToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        podcraftrId:podcraftrId,
      },
      { upsert: true }
    );
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
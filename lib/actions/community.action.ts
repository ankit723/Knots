"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Knot from "../models/knot.model";
import User from "../models/user.model";

import { connectedToDB } from "../mongoose";
import {redirect} from 'next/navigation'
import { revalidatePath } from "next/cache";

export async function createCommunity(
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string // Change the parameter name to reflect it's an id
) {
  try {
    connectedToDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: createdById });

    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const newCommunity = new Community({
      id: `org_${user.id}_${result}`,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();
    await addMemberToCommunity(createdCommunity.id, user.id)

    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();

    console.log("Created community object:", createdCommunity);

    redirect("/communities")
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}


export async function fetchCommunityDetails(id: string) {
  try {
    connectedToDB();

    const communityDetails = await Community.findOne({ id })
    .populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
      {
        path: "requests",
        model: User,
        select: "name username image _id id",
      },
    ]);
    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectedToDB();

    const communityPosts = await Community.findById(id).populate({
      path: "knots",
      model: Knot,
      populate: [
        {
          path: "author",
          model: User,
          select: "username image id", // Select the "name" and "_id" fields from the "User" model
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
            select: "image _id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });

    return communityPosts;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectedToDB();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function fetchCommunitiesByUserId({
  userId,
  sortBy = "desc",
}: {
  userId: string;
  sortBy?: SortOrder;
}) {
  try {
    await connectedToDB();

    // Create an initial query object to filter communities by userId.
    const query: FilterQuery<typeof Community> = { createdBy: userId };

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the userId and sort criteria.
    const communities = await Community.find(query)
      .sort(sortOptions)
      .populate("members")
      .exec();

    return { communities };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectedToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    await Community.updateOne(
      { _id: community._id },
      { $pull: { requests: user._id } }
    );

    redirect(`/communities/${community.id}`)
    return community
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectedToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id, requests: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  bio:string,
  image: string
) {
  try {
    connectedToDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image, bio }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    redirect(`/communities/${updatedCommunity.id}`)
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectedToDB();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });


    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    console.log(deletedCommunity._id)
    // Delete all Knots associated with the community
    await Knot.deleteMany({ community: deletedCommunity._id });

    // Find all users who are part of the community
    const communityUsers = await User.find({communities:deletedCommunity._id});

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(deletedCommunity._id);
      return user.save();
    });

    await Promise.all(updateUserPromises);
    redirect('/communities')

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}

export async function addMemberRequestToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectedToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.requests.includes(user._id)) {
      throw new Error("A request is Already raised to the community");
    }

    // Add the user's _id to the members array in the community
    community.requests.push(user._id);
    await community.save();

    // // Add the community's _id to the communities array in the user
    // user.communities.push(community._id);
    // await user.save();
    return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding member request to community:", error);
    throw error;
  }
}
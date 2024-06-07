"use server";

import { revalidatePath } from "next/cache";

import { connectedToDB } from "../mongoose";

import User from "../models/user.model";
import Knot from "../models/knot.model";
import Community from "../models/community.model";

export async function fetchKnots(pageNumber = 1, pageSize = 20) {
  connectedToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level knots) (a knot that is not a comment/reply).
  const postsQuery = Knot.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id username parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (knots) i.e., knots that are not comments.
  const totalPostsCount = await Knot.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createKnot({ text, author, communityId, path }: Params
) {
  try {
    connectedToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdKnot = await Knot.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { knots: createdKnot._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { knots: createdKnot._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create knot: ${error.message}`);
  }
}

async function fetchAllChildKnots(knotId: string): Promise<any[]> {
  const childKnots = await Knot.find({ parentId: knotId });

  const descendantKnots = [];
  for (const childKnot of childKnots) {
    const descendants = await fetchAllChildKnots(childKnot._id);
    descendantKnots.push(childKnot, ...descendants);
  }

  return descendantKnots;
}

export async function deleteKnot(id: string, path: string): Promise<void> {
  try {
    connectedToDB();

    // Find the knot to be deleted (the main knot)
    const mainKnot = await Knot.findById(id).populate("author community");

    if (!mainKnot) {
      throw new Error("Knot not found");
    }

    // Fetch all child knots and their descendants recursively
    const descendantKnots = await fetchAllChildKnots(id);

    // Get all descendant knot IDs including the main knot ID and child knot IDs
    const descendantKnotIds = [
      id,
      ...descendantKnots.map((knot) => knot._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantKnots.map((knot) => knot.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainKnot.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantKnots.map((knot) => knot.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainKnot.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child knots and their descendants
    await Knot.deleteMany({ _id: { $in: descendantKnotIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { knots: { $in: descendantKnotIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { knots: { $in: descendantKnotIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete knot: ${error.message}`);
  }
}

export async function fetchKnotById(knotId: string) {
  connectedToDB();

  try {
    const knot = await Knot.findById(knotId)
      .populate({
        path: "author",
        model: User,
        select: "_id id username image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id username parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Knot, // The model of the nested children (assuming it's the same "Knot" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id username parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return knot;
  } catch (err) {
    console.error("Error while fetching knot:", err);
    throw new Error("Unable to fetch knot");
  }
}

export async function addCommentToKnot(
  knotId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectedToDB();

  try {
    // Find the original knot by its ID
    const originalKnot = await Knot.findById(knotId);

    if (!originalKnot) {
      throw new Error("Knot not found");
    }

    // Create the new comment knot
    const commentKnot = new Knot({
      text: commentText,
      author: userId,
      parentId: knotId, // Set the parentId to the original knot's ID
    });

    // Save the comment knot to the database
    const savedCommentKnot = await commentKnot.save();

    // Add the comment knot's ID to the original knot's children array
    originalKnot.children.push(savedCommentKnot._id);

    // Save the updated original knot to the database
    await originalKnot.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
import { dislikeKnot, fetchKnotById, likeKnot } from "@/lib/actions/knot.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect, usePathname } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    redirect("/");
  }

  const user = await currentUser();

  if (!user) {
    redirect(`/knot/${params.id}`);
  }
  const likes=(await fetchKnotById(params.id)).likes

  const isLiked = likes.some((u:any) => u.id === user.id);


  const userInfo = await fetchUser(user?.id || "");

  if(isLiked){
    await dislikeKnot(params.id, userInfo._id)
  }else{
    await likeKnot(params.id, userInfo._id);
  }
  redirect(`/knot/${params.id}`);
};

export default page;

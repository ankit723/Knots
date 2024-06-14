import CommunityProfile from "@/components/forms/communityProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from 'next/navigation';
import Link from "next/link";

async function Page({ params }: { params: { id: string } }) {
  const userInfo = await fetchUser(params?.id || "");
  if (!userInfo) redirect("/sign-in");

  const userData = {
    id: userInfo?.id || "",
    objectId: (userInfo?._id).toString() || "",
    username: userInfo?.username || "",
    name: userInfo?.name || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || "",
  };

  console.log('User data being passed to client component:', userData);

  return (
    <main className="mx-auto flex max-w-3x] flex-col justify-start px-10 py-10">
      <h1 className="head-text">Community</h1>
      <p className="mt-3 text-base-regular text-light-2">Complete your Community profile now!</p>

      <section className="mt-9 bg-dark-2 p-10">
        <CommunityProfile user={userData} btnTitle={"Continue"} />
        <div className="w-full flex justify-center items-center my-10">
          <Link href={'/'} className='text-heading5-bold text-[#7f7f7f] px-5 py-2 rounded-lg'>
            Delete and Go Back
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Page;

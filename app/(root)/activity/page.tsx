import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getActivity } from "@/lib/actions/user.action"
import Link from "next/link"
import Image from "next/image"


const Page = async() => {

  const user=await currentUser()
  if(!user) redirect('/sign-in')

  const userInfo=await fetchUser(user.id);
  if(!userInfo) redirect('/onboarding')

  const activities=await getActivity(userInfo._id)

  return (
    <section>
        <h1 className="head-text mb-10">Activity</h1>

        <section className="mt-10 flex flex-col gap-5">
          {activities.length>0?(
            <>
            {activities.map((activity)=>(
              <Link key={activity._id} href={`/knot/${activity.parentId}`}>
                <article className="activity-card">
                  <Image src={activity.author.image} alt="Profile Picture" width={20} height={20} className="rounded-full object-cover"/>
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.username}
                    </span>{" "}
                    replied to your Knot
                  </p>
                </article>
              </Link>
            ))}
            </>
          ):<p className="!text-base-regular text-light-3">No activity yet</p>}

        </section>
    </section>
  )
}
  
export default Page
  
import { fetchKnots } from "@/lib/actions/knot.action"
import { currentUser } from "@clerk/nextjs/server"
import KnotCard from "@/components/cards/knotCard"

export default async function Home() {
  const user= await currentUser()
  const result = await fetchKnots(1, 30)

  console.log(result)
  return(
    <div>
      <h1 className="head-text">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length===0?(
          <p className="no-result">No Knots To Hook You On</p>
        ):(
          <>
            {result.posts.map((post)=>(
              <KnotCard 
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.childrens}
              />
            ))}
          </>
        )}
      </section>
    </div>

  )
}
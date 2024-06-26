import { fetchKnots } from "@/lib/actions/knot.action"
import { currentUser } from "@clerk/nextjs/server"
import KnotCard from "@/components/cards/knotCard"

export default async function Home() {
  const user= await currentUser()
  const result = await fetchKnots(1, 30)

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
                key={(post._id).toString()}
                id={(post._id).toString()}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                image={post.imageUrl?post.imageUrl:null}
                author={post.author}
                likes={post.likes}
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
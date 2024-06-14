'use client'
import Image from "next/image"
import { deleteCommunity } from "@/lib/actions/community.action"

const CommunityDeleteActionButton = ({id}:{id:string}) => {
  return(
    <Image src="/assets/delete.svg" alt="edit" width={17} height={17} className='cursor-pointer' onClick={async()=>{
      await deleteCommunity(id)
      window.location.reload()
    
    }}/>
  )
}

export default CommunityDeleteActionButton

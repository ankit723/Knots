import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <div className="flex gap-3 items-center mt-10 justify-start">
        <h1 className="head-text">Welcome, To the connection page of the</h1>
        <Link  href='https://podcraftr.vercel.app' target='_blank'><Image src="/assets/podcraftr.svg" width={30} height={30} alt="podcraftr"/></Link> 
        <h1 className="head-text">Podcraftr</h1>
      </div>
    </div>
  )
}

export default page

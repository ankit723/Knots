import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const page = () => {
  return (
    <div>
        <h1 className="head-text mb-10">Connect Your Apps</h1>

        <div className="w-full flex justify-between items-center mt-20">
            <Link  href='/connect-app/podcraftr'><Image src="/assets/podcraftr.svg" width={50} height={50} alt="podcraftr"/></Link>
            <Image src="/assets/facebook-disabled.webp" width={50} height={50} alt="facebook" className='rounded-lg cursor-not-allowed'/>
            <Image src="/assets/instagram-disabled.jpeg" width={50} height={50} alt="instagram" className='rounded-lg cursor-not-allowed'/>
        </div>
    </div>
  )
}

export default page

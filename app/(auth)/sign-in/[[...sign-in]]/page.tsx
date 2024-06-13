import { SignIn } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from "next/link";



export default function Page() {
  return (
    <div className="flex flex-col justify-start items-center px-10 bg-30-black-70-white py-20 gap-16">
      <div className="w-full md:px-36 px-0 flex flex-col">
        <Image src='/assets/logo.png' alt='logo' width={34} height={34}/>
        <h1 className="text-white head-text">Welcome back!</h1>
        <p className="text-[#9e9e9e] text-left font-light">Please Sign In to access your tied knots</p>
      </div>

      <div className="flex justify-center items-end flex-col gap-2">
        <div className="bg-black px-2 md:px-10 py-10 border border-[#ffffff5d] rounded-xl flex flex-col gap-5">
          <h1 className="text-white text-heading3-bold">Sign In Now!</h1>
          <SignIn appearance={{baseTheme:dark}}/>
          <p className="text-[#9e9e9e] text-left font-light text-small-regular max-w-96">You either connect your Google / Github or can login directly using your Email.</p>
        </div>
        <Link href="/" className="text-[#9e9e9e] test-left">Authenticate Later</Link>
      </div>
    </div>
  );
}
import { SignUp } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from "next/link";



export default function Page() {
  return (
    <div className="flex flex-col justify-start items-center  px-10 bg-30-black-70-white py-20 gap-20">
      <div className="w-full md:px-36 px-0 flex flex-col">
        <Image src='/assets/logo.png' alt='logo' width={34} height={34}/>
        <p className="text-[#9e9e9e] text-left font-light">Let&#39;s get you tied you to the Knots</p>
        <h1 className="text-white head-text">Sign Up Now! To get connected to the world of knots</h1>
      </div>

      <div className="flex flex-col justify-center items-end">
        <div className="bg-black px-3 md:px-10 py-10 border border-[#ffffff5d] rounded-xl flex flex-col gap-5">
          <h1 className="text-white text-heading3-bold">Sign Up Now!</h1>
          <SignUp appearance={{baseTheme:dark}}/>
          <p className="text-[#9e9e9e] text-left font-light text-small-regular max-w-96">You either connect your Google / Github or can login directly using your Email.</p>
        </div>
        <Link href="/" className="text-[#9e9e9e] test-left">Authenticate Later</Link>
      </div>
    </div>
  );
}
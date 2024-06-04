import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default function Page() {
  return (
    <SignIn />
  );
}
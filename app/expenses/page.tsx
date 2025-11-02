"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export default function Page() {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-3">
        <h1>hi, {session?.user.name}</h1>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    </>
  );
}

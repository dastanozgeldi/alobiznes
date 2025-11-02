import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-2 self-center font-medium">
        <Image
          className="rounded-full"
          src="/logo.png"
          alt="logo"
          width={24}
          height={24}
        />
        Ало, бизнес?
      </div>
      <LoginForm />
    </div>
  );
}

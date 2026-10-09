import { RegisterForm } from "@/components/form/register-form";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-[#f0fafc] flex flex-col justify-center items-center gap-y-10">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logoClear.png" alt="Logo" width={300} height={300} />
        </Link>
        <Image
          src="/loginPage.jpg"
          alt="loginPic"
          width={500}
          height={500}
          // className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="bg-[#d7eef4] flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

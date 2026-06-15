import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.action";
import { redirect } from "next/navigation";

const Register = async ({ params }: SearchParamProps) => {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
            priority
          />

          <RegisterForm user={user} />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2026 Afryco Core
            </p>
            <Link href="/?admin=true" className="text-green-500"></Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[750px]"
        priority
      />
    </div>
  );
};

export default Register;

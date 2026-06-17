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
    <div className="flex h-screen w-screen max-h-screen overflow-hidden bg-dark-300">
      <section className="remove-scrollbar w-full md:w-[55%] h-full overflow-y-auto px-6 py-10 sm:px-10 flex flex-col justify-between">
        <div className="sub-container max-w-[580px] w-full mx-auto my-auto">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient logo"
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
      <div className="hidden h-full md:block md:w-[45%] relative border-l border-dark-500 bg-dark-300">
        <Image
          src="/assets/images/register-img.jpg"
          fill
          alt="patient profile side art"
          className="side-img object-cover"
          sizes="(max-width: 768px) 0vw, 45vw"
          priority
        />
      </div>
    </div>
  );
};

export default Register;

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
    <div className="flex h-screen w-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient logo"
            className="mb-12 h-10 w-fit"
            priority
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">© 2026 Afryco Core</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        alt="patient profile side art"
        className="side-img max-w-[390px]"
        height={1000}
        width={1000}
        priority
      />
    </div>
  );
};

export default Register;

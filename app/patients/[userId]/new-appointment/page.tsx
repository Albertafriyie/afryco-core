import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { getPatient } from "@/lib/actions/patient.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// 1. Params is treated as a Promise type in modern Next.js
export default async function NewAppointment({ params }: SearchParamProps) {
  // 2. Await the params promise to safely extract userId
  const { userId } = await params;

  // Fetch patient profile data
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
            priority
          />

          {/* 3. Added optional chaining (patient?.$id) to prevent application crashes */}
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id || ""}
          />

          <p className="copyright mt-10 py-12">© 2026 Afryco Core</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[300px] bg-bottom"
        priority
      />
    </div>
  );
}

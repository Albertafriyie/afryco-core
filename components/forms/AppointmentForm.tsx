"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
// 1. Import the dynamic schema selector function
import { AppointmentFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/lib/actions/appointment.action"; // Make sure to create/import this
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  // 3. Handle data structure submission based on create/cancel action
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    try {
      let status;
      if (type === "cancel") {
        status = "cancelled";
      } else if (type === "schedule") {
        status = "scheduled";
      } else {
        status = "pending";
      }

      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician!,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };

        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`,
          );
        }
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">
            {type === "create" ? "New Appointment" : "Cancel Appointment"}
          </h1>
          <p className="text-dark-700">
            {type === "create"
              ? "Request a new appointment in 10 seconds."
              : "Please provide a reason for cancelling."}
          </p>
        </section>

        {type !== "cancel" && (
          <>
            {/* 4. This field will no longer be red because the schema matches! */}
            <CustomFormField
              control={form.control}
              name="primaryPhysician"
              fieldType={FormFieldType.SELECT}
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              name="schedule"
              fieldType={FormFieldType.DATE_PICKER}
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                name="reason"
                fieldType={FormFieldType.TEXTAREA}
                label="Reason for appointment"
                placeholder="Enter reason for appointment e.g. annual check-up, follow-up"
              />

              <CustomFormField
                control={form.control}
                name="note"
                fieldType={FormFieldType.TEXTAREA}
                label="Notes / Comments"
                placeholder="Enter notes e.g. prefer morning slots if available"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            control={form.control}
            name="cancellationReason"
            fieldType={FormFieldType.TEXTAREA}
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation e.g. urgent conflict arose"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={
            type === "cancel"
              ? "shad-danger-btn w-full"
              : "shad-primary-btn w-full"
          }
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;

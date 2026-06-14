"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.action";

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      username: "",
      description: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    username,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = {
        username,
        email,
        phone,
      };
      const user = await createUser(userData);

      if (user) router.push(`/patients/${user.id}/register`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 🖐️</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField
          control={form.control}
          name="username"
          fieldType={FormFieldType.INPUT}
          label="Full name"
          placeholder="John Doe"
          iconSrc="\assets\icons\user.svg"
          iconAlt="User icon"
        />

        <CustomFormField
          control={form.control}
          name="email"
          fieldType={FormFieldType.INPUT}
          label="Email"
          placeholder="johndoe@example.com"
          iconSrc="\assets\icons\email.svg"
          iconAlt="Email icon"
        />

        <CustomFormField
          control={form.control}
          name="phone"
          fieldType={FormFieldType.PHONE_INPUT}
          label="Phone Number"
          placeholder="(+233) 24 123 4567"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;

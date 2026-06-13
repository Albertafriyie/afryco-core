"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";

const formSchema = z.object({
  title: z.string().min(5, "Bug title must be at least 5 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  email: z.string().min(5, "Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

const PatientForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
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
          name="title"
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PatientForm;

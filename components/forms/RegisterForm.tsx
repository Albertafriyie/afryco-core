"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.action";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";

interface User {
  $id: string;
  name: string;
  email: string;
  phone: string;
}

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      username: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    try {
      let formData;
      if (
        values.identificationDocument &&
        values.identificationDocument.length > 0
      ) {
        formData = new FormData();
        formData.append("blobFile", values.identificationDocument[0]);
        formData.append("fileName", values.identificationDocument[0].name);
      }
      const patientData = {
        userId: user.$id,
        name: values.username,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate,
        gender: values.gender,
        address: values.address || "",
        occupation: values.occupation || "",
        emergencyContactName: values.emergencyContactName || "",
        emergencyContactNumber: values.emergencyContactNumber || "",
        primaryPhysician: values.primaryPhysician || "",
        insuranceProvider: values.insuranceProvider || "",
        insurancePolicyNumber: values.insurancePolicyNumber || "",
        allergies: values.allergies || "",
        currentMedication: values.currentMedication || "",
        familyMedicalHistory: values.familyMedicalHistory || "",
        pastMedicalHistory: values.pastMedicalHistory || "",
        identificationType: values.identificationType || "",
        identificationNumber: values.identificationNumber || "",
        identificationDocument: formData,
        privacyConsent: values.privacyConsent || false,
        treatmentConsent: values.treatmentConsent || false,
        disclosureConsent: values.disclosureConsent || false,
        userConsent: values.privacyConsent && values.treatmentConsent,
      };

      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 🖐️</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          name="username"
          fieldType={FormFieldType.INPUT}
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="User icon"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="email"
            fieldType={FormFieldType.INPUT}
            label="Email"
            placeholder="johndoe@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="Email icon"
          />

          <CustomFormField
            control={form.control}
            name="phone"
            fieldType={FormFieldType.PHONE_INPUT}
            label="Phone Number"
            placeholder="(+233) 24 123 4567"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="birthDate"
            fieldType={FormFieldType.DATE_PICKER}
            label="Date of Birth"
          />

          <CustomFormField
            control={form.control}
            name="gender"
            fieldType={FormFieldType.SKELETON}
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={(value) =>
                    form.setValue(
                      "gender",
                      value as "Male" | "Female" | "Other",
                    )
                  }
                  defaultValue={field.value as string}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="address"
            fieldType={FormFieldType.INPUT}
            label="Address"
            placeholder="Atonsu, Kumasi"
          />

          <CustomFormField
            control={form.control}
            name="occupation"
            fieldType={FormFieldType.INPUT}
            label="Occupation"
            placeholder="Teacher"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="emergencyContactName"
            fieldType={FormFieldType.INPUT}
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            control={form.control}
            name="emergencyContactNumber"
            fieldType={FormFieldType.PHONE_INPUT}
            label="Emergency contact number"
            placeholder="(+233) 24 123 4567"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          name="primaryPhysician"
          fieldType={FormFieldType.SELECT}
          label="Primary Physician"
          placeholder="Select a physician"
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="insuranceProvider"
            fieldType={FormFieldType.INPUT}
            label="Insurance Provider"
            placeholder="NHIS"
          />

          <CustomFormField
            control={form.control}
            name="insurancePolicyNumber"
            fieldType={FormFieldType.INPUT}
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="allergies"
            fieldType={FormFieldType.TEXTAREA}
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />

          <CustomFormField
            control={form.control}
            name="currentMedication"
            fieldType={FormFieldType.TEXTAREA}
            label="Current medication (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="familyMedicalHistory"
            fieldType={FormFieldType.TEXTAREA}
            label="Family medical history (if any)"
            placeholder="Mother has diabetes, Father had a heart disease"
          />

          <CustomFormField
            control={form.control}
            name="pastMedicalHistory"
            fieldType={FormFieldType.TEXTAREA}
            label="Past medical history"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          name="identificationType"
          fieldType={FormFieldType.SELECT}
          label="Identification type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          control={form.control}
          name="identificationNumber"
          fieldType={FormFieldType.INPUT}
          label="Identification number"
          placeholder="123456789"
        />

        <CustomFormField
          control={form.control}
          name="identificationDocument"
          fieldType={FormFieldType.SKELETON}
          label="Scanned copy of identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader
                files={field.value as File[] | undefined}
                onChange={field.onChange}
              />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;

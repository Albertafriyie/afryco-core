"use client";
import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";
import Image from "next/image";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  SELECT = "select",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}

interface CustomProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
}

type RenderFieldProps<TFieldValues extends FieldValues> = Omit<
  CustomProps<TFieldValues>,
  "control"
>;

const RenderField = <TFieldValues extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>;
  props: RenderFieldProps<TFieldValues>;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-input bg-background pl-3 items-center gap-2">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              alt={props.iconAlt || "Icon"}
              width={24}
              height={24}
              className="w-5 h-5"
              priority
            />
          )}
          <Input
            type="text"
            placeholder={props.placeholder || "John Doe"}
            {...field}
          />
        </div>
      );
    default:
      return null;
  }
};

const CustomFormField = <TFieldValues extends FieldValues>(
  props: CustomProps<TFieldValues>,
) => {
  const { control, name, fieldType, label, placeholder, iconSrc, iconAlt } =
    props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};
export default CustomFormField;

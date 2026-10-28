import { useFormContext } from "react-hook-form";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function useFormField() {
  const { register, formState: { errors } } = useFormContext();

  return { register, errors };
}

interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: FormFieldProps) {
  const { register, errors } = useFormField();
  const error = errors[name];

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={cn(error && "border-destructive")}
      />
      {error && (
        <p className="text-sm text-destructive">{String(error.message)}</p>
      )}
    </div>
  );
}


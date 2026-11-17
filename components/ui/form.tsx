"use client";

import * as React from "react";
import type { z } from "zod";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type FieldErrors<TValues extends Record<string, unknown>> = Partial<
  Record<keyof TValues, string>
>;

export interface ZodFormReturn<TValues extends Record<string, unknown>> {
  values: TValues;
  errors: FieldErrors<TValues>;
  isSubmitting: boolean;
  setValue: <K extends keyof TValues>(field: K, value: TValues[K]) => void;
  reset: (next?: TValues) => void;
  handleSubmit: (
    onValid: (data: TValues) => Promise<void> | void
  ) => (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useZodForm<TSchema extends z.ZodTypeAny>(options: {
  schema: TSchema;
  defaultValues: z.infer<TSchema>;
}): ZodFormReturn<z.infer<TSchema> & Record<string, unknown>> {
  type TValues = z.infer<TSchema> & Record<string, unknown>;
  const [values, setValues] = React.useState<TValues>(
    options.defaultValues as TValues
  );
  const [errors, setErrors] = React.useState<FieldErrors<TValues>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const setValue = React.useCallback(
    <K extends keyof TValues>(field: K, value: TValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const reset = React.useCallback(
    (next?: TValues) => {
      setValues((next ?? options.defaultValues) as TValues);
      setErrors({});
    },
    [options.defaultValues]
  );

  const handleSubmit = React.useCallback(
    (onValid: (data: TValues) => Promise<void> | void) =>
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsed = options.schema.safeParse(values);
        if (!parsed.success) {
          const nextErrors: FieldErrors<TValues> = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path[0] as keyof TValues | undefined;
            if (key && !nextErrors[key]) {
              nextErrors[key] = issue.message;
            }
          }
          setErrors(nextErrors);
          return;
        }
        setErrors({});
        setIsSubmitting(true);
        try {
          await onValid(parsed.data as TValues);
        } finally {
          setIsSubmitting(false);
        }
      },
    [options.schema, values]
  );

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    reset,
    handleSubmit,
  };
}

interface FormItemContextValue {
  id: string;
  name: string;
  error?: string;
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

export function Form<TValues extends Record<string, unknown>>({
  form: _form,
  className,
  ...props
}: React.ComponentProps<"form"> & { form?: ZodFormReturn<TValues> }) {
  return <form className={cn("space-y-4", className)} {...props} />;
}

export function FormField<TValues extends Record<string, unknown>, K extends keyof TValues>({
  form,
  name,
  render,
}: {
  form: ZodFormReturn<TValues>;
  name: K;
  render: (args: {
    field: {
      name: K;
      value: TValues[K];
      onChange: (value: TValues[K]) => void;
    };
    error?: string;
  }) => React.ReactNode;
}) {
  const id = React.useId();
  const error = form.errors[name];

  return (
    <FormItemContext.Provider
      value={{ id, name: String(name), error }}
    >
      {render({
        field: {
          name,
          value: form.values[name],
          onChange: (val) => form.setValue(name, val),
        },
        error,
      })}
    </FormItemContext.Provider>
  );
}

export function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-item" className={cn("grid gap-1.5", className)} {...props} />;
}

export function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const ctx = React.useContext(FormItemContext);
  return (
    <Label
      data-slot="form-label"
      htmlFor={ctx?.id}
      className={cn(
        "text-xs font-medium text-foreground",
        ctx?.error && "text-destructive",
        className
      )}
      {...props}
    />
  );
}

export function FormControl({ children }: { children: React.ReactElement<{ id?: string; "aria-invalid"?: boolean }> }) {
  const ctx = React.useContext(FormItemContext);
  return React.cloneElement(children, {
    id: ctx?.id,
    "aria-invalid": Boolean(ctx?.error),
  });
}

export function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-[11px] text-muted-foreground", className)}
      {...props}
    />
  );
}

export function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const ctx = React.useContext(FormItemContext);
  const body = children ?? ctx?.error;
  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

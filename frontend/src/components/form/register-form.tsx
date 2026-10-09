"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import type z from "zod";
import { useRegistration } from "@/hooks";
import { toast } from "../ui/toast";
import { RegisterZodSchema } from "@/validation";
import { Skeleton } from "../ui/skeleton";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  type UserDefaultValues = z.infer<typeof RegisterZodSchema>;

  const defaultValues: UserDefaultValues = {
    name: "",
    email: "",
    password: "Super@admin321",
    confirmPassword: "Super@admin321",
    
    status: "ACTIVE",
    emailVerified: false,
    needPasswordChange: false,
    
    profileImage: "",
    phone: "01723445566",
    department: "",
    designation: "",
    bio: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    joiningDate: "",
    employeeId: "",
  };

  const { mutate: registration, isPending:registrationIPending } = useRegistration();

const form = useForm({
  defaultValues,

  validators: {
    onSubmit: RegisterZodSchema,
  },

  onSubmit: async ({ value }) => {
    setHasSubmitted(true);
    console.log(value)
    const registrationData = {
      name: value.name,
      email: value.email,
      password: value.password,
      confirmPassword: value.confirmPassword,
      // profileImage: value.profileImage,
      phone: value.phone,
      department: value.department,
      designation: value.designation,
      status: value.status,
      emailVerified: value.emailVerified,
      needPasswordChange: value.needPasswordChange,

      profile: {
        bio: value.bio,
        address: value.address,
        city: value.city,
        postalCode: value.postalCode,
        country: value.country,
        dateOfBirth: value.dateOfBirth,
        emergencyContactName: value.emergencyContactName,
        emergencyContactPhone: value.emergencyContactPhone,
        joiningDate: value.joiningDate,
        employeeId: value.employeeId,
      },
    };

    registration(registrationData, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Registration Failure",
            description:
              res.message || "Something went wrong. Please try again",
            type: "error",
          });
          return;
        }

        toast.add({
          title: "Registration Successful",
          description:
            res.message ||
            "Please verify your account to complete registration",
          type: "success",
        });

        const params = new URLSearchParams({
          email: registrationData.email,
        });

        router.push(
          `/register/verify-account?${params.toString()}`,
        );
      },

      onError: (err) => {
        toast.add({
          title: "Registration Failure",
          description:
            err.message || "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  },
});
  return (
     <div className="bg-white border rounded-md shadow-md overflow-hidden">
      <div className="h-2 bg-linear-to-r from-[#1a7eca] to-[#80c7bf]"></div>
      <div className="flex flex-col gap-6">
        <div className="bg-linear-to-r from-[#d1edf9] to-[#dde4f7] flex flex-col items-center gap-2 text-center py-4">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="px-5"
        >
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              {/* <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="John Doe"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field> */}
              
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                (field.state.meta.isTouched || hasSubmitted) &&
                !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter your Full name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />

                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          </form.Field>

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="m@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <form.Field name="password">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          placeholder="*********"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="pr-10"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="*********"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="pr-10"
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
              <form.Field name="phone">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          placeholder="+880 1712 345678"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="department">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="IT"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="designation">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Designation</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Employee"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="bio">
              {(field) => {
                 const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>BIO</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Tell us about yourself..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="name"
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
                }}
            </form.Field>
            <form.Field name="address">
              {(field) => {
                 const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        placeholder="Enter your address..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="name"
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
                }}
            </form.Field>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
              <form.Field name="city">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>City</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Enter your city..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                  );
                  }}
              </form.Field>

              <form.Field name="postalCode">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Postal Code</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Enter your postal code..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                          />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                  );
                  }}
              </form.Field>

              <form.Field name="country">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Enter your country..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                          />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                  );
                  }}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <form.Field name="emergencyContactName">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Emergency Contact Name
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Enter your emergency contact name..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                  }}
              </form.Field>

              <form.Field name="emergencyContactPhone">
                {(field) => {
                   const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Emergency Contact Phone
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Enter your emergency contact phone..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                  );
                  }}
              </form.Field>
                   
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <form.Field name="dateOfBirth">
                {(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Date of Birth
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          placeholder="Enter your Date of Birth..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="joiningDate">
                {(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched || hasSubmitted) &&
                    !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Joining Date
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          placeholder="Enter your joining date."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="name"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
            <Button
              type="submit"
              disabled={registrationIPending || form.state.isSubmitting}
            >
              {registrationIPending || form.state.isSubmitting
                ? "Registering..."
                : "Create account"}
            </Button>
          </FieldGroup>
        </form>
              <div className="px-5">
        <FieldSeparator>Or continue with</FieldSeparator>
              </div>
              <div className="px-5">
        <GoogleLoginComponent />
              </div>


        <div className="text-center text-sm text-muted-foreground px-5 pb-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </div>
      </div>
     </div>
  );
}

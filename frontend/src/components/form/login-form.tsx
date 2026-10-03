"use client";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { LoginZodSchema } from "@/validation/auth.validation";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import { Input } from "../ui/input";
import { useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "super_admin@gmail.com",
      password: "Password@123",

      // email:"testeradmin@gmail.com",
      // password: "Tester@admin321"

      // email: "ramentusuka@gmail.com",
      // password: "X}A0n_SZ8o=[",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };
      login(loginData, {
        onSuccess: (res) => {
          toast.add({
            title: "Login Success",
            description: res.message,
            type: "Success",
          });
          router.push("/");
        },
        onError: (error) => {
          console.log(error);
          toast.add({
            title: "Authorization Failed",
            description:
              error.message || "Something went wrong. Please try again.",
            type: "Success",
          });
        },
      });
    },
  });

  return (
    <div className="bg-white border rounded-md shadow-md overflow-hidden">
      <div className="h-2 bg-linear-to-r from-[#1a7eca] to-[#80c7bf]"></div>
      <div className="flex flex-col gap-5">
        <div className="bg-linear-to-r from-[#d1edf9] to-[#dde4f7] flex flex-col items-center gap-2 text-center py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {" "}
            Login to your Account
          </h1>
          {/* <p className="text-balance text-sm text-muted-foreground">
            Enter your email and password below to login
          </p> */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="px-5"
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="off"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        name={field.name}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                        autoComplete="off"
                        aria-invalid={isInvalid}
                      />
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeClosed className="size-4" />
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

            <Button disabled={loginPending} type="submit">
              {loginPending ? (
                <>
                  <Spinner /> Submitting
                </>
              ) : (
                "Submit"
              )}
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
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Register
          </Link>
        </div>
        {/* // <GoogleLogin
      //   theme="outline"
      //   shape="pill"
      //   text="continue_with"
      //   onSuccess={handleGoogleSuccess}
      //   onError={handleGoogleError}
      // /> */}
      </div>
    </div>
  );
};

export default LoginForm;

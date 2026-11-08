"use client";
import { useState } from "react";
import { Eye, EyeClosed, ShieldCheck, User } from "lucide-react";
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

type LoginPayload = { email: string; password: string };

// One-click demo accounts
const QUICK_LOGINS = [
  {
    key: "superadmin",
    label: "Super Admin",
    icon: ShieldCheck,
    credentials: { email: "superadmin@gmail.com", password: "Super@admin321" },
  },
  {
    key: "employee",
    label: "Employee",
    icon: User,
    credentials: { email: "employee@gmail.com", password: "Super@admin321" },
  },
] as const;

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  // which quick-login button is currently loading
  const [activeQuickLogin, setActiveQuickLogin] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: login, isPending: loginPending } = useLogin();

  const handleLogin = (loginData: LoginPayload) => {
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
        const errorMessage =
          typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
            ? error.data.message
            : error instanceof Error
              ? error.message
              : "Failed to Login due to authentication.";
        toast.add({
          type: "error",
          title: errorMessage,
        });
      },
      onSettled: () => setActiveQuickLogin(null),
    });
  };

  const handleQuickLogin = (key: string, credentials: LoginPayload) => {
    setActiveQuickLogin(key);
    // keep the form fields in sync so the user sees who is logging in
    form.setFieldValue("email", credentials.email);
    form.setFieldValue("password", credentials.password);
    handleLogin(credentials);
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: ({ value }) => {
      handleLogin({ email: value.email, password: value.password });
    },
  });

  return (
    <div className="bg-white border rounded-md shadow-md overflow-hidden">
      <div className="h-2 bg-linear-to-r from-[#1a7eca] to-[#80c7bf]"></div>
      <div className="flex flex-col gap-5">
        <div className="bg-linear-to-r from-[#d1edf9] to-[#dde4f7] flex flex-col items-center gap-2 text-center py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Login to your Account
          </h1>
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
                      placeholder={"example@mail.com"}
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
                        placeholder={"**************"}
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
              {loginPending && !activeQuickLogin ? (
                <>
                  <Spinner /> Submitting
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* One-click login */}
        <div className="px-5">
          <FieldSeparator>Quick login</FieldSeparator>
        </div>
        <div className="px-5 grid grid-cols-2 gap-3">
          {QUICK_LOGINS.map(({ key, label, icon: Icon, credentials }) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              disabled={loginPending}
              onClick={() => handleQuickLogin(key, credentials)}
              className="h-10 gap-2 border-[#1a7eca]/40 hover:bg-[#d1edf9]"
            >
              {activeQuickLogin === key ? (
                <Spinner />
              ) : (
                <Icon className="size-4" />
              )}
              {label}
            </Button>
          ))}
        </div>

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
      </div>
    </div>
  );
};

export default LoginForm;

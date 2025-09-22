"use client";
import { loginUser } from "@/lib/api";
import { authStore } from "@/lib/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../ui/Button";
import FormError from "../ui/FormError";
import Input from "../ui/Input";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LoginForm() {
  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await loginUser(data);
      if (!response.message) {
        const error = await response.json();
        setServerError(error.message);
      } else {
        setLoggedIn(true);
        console.log("Account loggedIn successful:", response);
        router.push("/dashboard");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string>("");
  const router = useRouter();
  const { setLoggedIn } = authStore();

  return (
    <form
      className="space-y-4 w-full max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-bold mb-4">Login your Account</h2>
      {serverError && (
        <div className="text-red-500 mb-4">
          {serverError && <FormError message={serverError} />}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
        id="email"
      ></Input>

      <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
        id="password"
      ></Input>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Login Account..." : "Login"}
      </Button>
    </form>
  );
}

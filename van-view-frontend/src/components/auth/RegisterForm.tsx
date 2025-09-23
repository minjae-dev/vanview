"use client";
import { registerUser } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../ui/Button";
import FormError from "../ui/FormError";
import Input from "../ui/Input";

const formSchema = z.object({
  firstName: z.string().min(2, "First is required"),
  lastName: z.string().min(2, "Last is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type FormSchema = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const onSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    setServerError('');

    try {
      const apiData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };

      const response = await registerUser(apiData);
      if (!response.token) {
        const error = await response.json();
        setServerError(error.message);
      } else {
        router.push('/login');
      } 
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally { 
      setIsLoading(false);
    }
  };

  const { register, handleSubmit, formState : {errors} } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string>('');
  const router = useRouter();

  return <form className="space-y-4 w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
    
    <h2 className="text-2xl font-bold mb-4">Create your Account</h2>
    {serverError && <div className="text-red-500 mb-4">{serverError && <FormError message={serverError} />}</div>}
    <Input
      label="First Name"
      type="text"
      {...register("firstName")}
      error={errors.firstName?.message}
    ></Input>

    <Input
      label="Last Name"
      type="text"
      {...register("lastName")}
      error={errors.lastName?.message}
      id="lastName"
    ></Input>

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

    <Input
      label="Confirm Password"
      type="password"
      {...register("confirmPassword")}
      error={errors.confirmPassword?.message}
      id="confirmPassword"
    ></Input>

    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Creating Account..." : "Register"  }
    </Button>
  </form>;
    
} 


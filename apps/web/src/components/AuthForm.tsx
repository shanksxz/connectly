"use client"

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { toast } from "sonner";
import { signUpSchema, signUpSchemaType } from '@/types';
import { font } from '@/utils';

export default function AuthForm({ mode }: { mode : 'signin' | 'signup' }) {
  const router = useRouter();
  const isLogin = mode === 'signin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: signUpSchemaType) => {
    console.log("submitting", data);
    try {
      if (isLogin) {
        console.log("here");
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (res?.ok) {
          toast.success("Logged in successfully");
          router.push("/");
        } else {
          throw new Error(res?.error || "Failed to login");
        }
      } else {
        const res = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status !== 200) {
          const error = await res.json();
          throw new Error(error.error);
        }

        toast.success("Account created successfully");
        router.push("/auth/signin");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to ${isLogin ? 'login' : 'create account'}. Please try again.`);
      }
    }
  };

  return (
    <section className={`h-screen flex justify-center items-center ${font.className}`}>
      <Card className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Enter your email below to login to your account'
                : 'Enter your information to create an account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="maxrobinson"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <span className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </span>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? (isLogin ? "Logging in..." : "Signing up...")
                  : (isLogin ? "Login" : "Create an account")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {isLogin ? (
                <Link href="/auth/signup">
                  Don&apos;t have an account? Sign up
                </Link>
              ) : (
                <Link href="/auth/signin">
                  Already have an account? Sign in
                </Link>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}
import { useState, useEffect } from "react";
import "../styles/auth.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod"; // Import Zod for schema validation
import type { InsertUser } from "@/types/schema";

// Define schemas for login and registration
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginUser = z.infer<typeof loginSchema>;
type RegisterUser = z.infer<typeof registerSchema>;
type FormData = LoginUser & Partial<RegisterUser>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useUser();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const result = await (isLogin 
        ? login({ username: data.username, password: data.password })
        : register(data as InsertUser));
      if (!result.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Something went wrong",
        });
        return;
      }

      toast({
        title: "Success",
        description: isLogin ? "Welcome back!" : "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Unexpected error occurred",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center auth-background p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-20">
        {/* Welcome Section */}
        <div className="hidden md:flex flex-col justify-center items-center text-white p-12">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-8">Welcome to SoulSync</h1>
            <p className="text-2xl font-semibold opacity-90 mt-4">
              Your personal space for reflection and growth
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="w-full max-w-md auth-card">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Sign in to your account to continue your journey"
              : "Begin your journey of self-discovery"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          {...field} 
                          className="auth-input pl-10" 
                          placeholder="Enter your username"
                        />
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="password" 
                          {...field} 
                          className="auth-input pl-10"
                          placeholder="Enter your password"
                        />
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button type="submit" className="w-full auth-button bg-gradient-to-r from-[#D5BDAF] to-[#B5838D] hover:from-[#C5AD9F] hover:to-[#A5737D] text-white">
                  {isLogin ? "Sign In" : "Sign Up"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full auth-button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    form.reset();
                  }}
                >
                  {isLogin
                    ? "Create New Account"
                    : "Sign In to Existing Account"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import banner from "../../public/banner.svg"; // Ensure correct path
import logo from "../../public/logo.svg"; // Ensure correct path
import { useDispatch, useSelector } from "react-redux";
import { LoginSchema } from "../schemas/auth.schema";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { toast } from "../components/ui/use-toast";
import { login } from "../store/auth/action";

const LoginPage = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, token, currentUser } = useSelector((state) => state.auth);
  const form = useForm({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    console.log("Effect running...");
    if (!isLoading && token && currentUser) {
        navigate("/admin");
    }
}, [isLoading, token, currentUser, navigate]);

  async function onSubmit(data) {
    console.log("Form submitted with data: ", data);
    try {
      dispatch(login(data)).unwrap();
    } catch (err) {
      console.log(err);
    }
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex h-screen">
      {/* SVG Banner Section */}
      <div className="w-1/2 h-full hidden lg:flex items-center justify-center bg-gray-100">
        <img src={banner} alt="Banner" className="object-fill w-full h-full" />
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center bg-white p-6 lg:p-12">
        <div className="w-1/2 text-xs max-w-sm">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-semibold mb-4 text-center">Sign in</h1>
          <p className="text-gray-600 mb-4 text-center">
            Welcome back! Please enter your details.
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {error}
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="emp_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Employee ID" {...field} />
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
                      <Input
                        type="password"
                        placeholder="**********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full flex justify-center items-center"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useRegisterMutation } from "../features/auth/authApi";
import Layout from "../Components/layout/Layout";

// ⭐ TS Interface
interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const payload = { ...data, role: "admin" };

      const response = await registerUser(payload).unwrap();

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      console.error("REGISTER ERROR:", error);
      toast.error(error?.data?.error || "Registration failed.");
    }
  };

  return (
    <Layout hideChrome>
      <div className="min-h-screen flex justify-center bg-gray-100 px-4 py-10 overflow-y-auto">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">

          <div className="text-center mb-6">
            <img src="/image/logo.webp" alt="Admin Register"
              className="mx-auto w-24 h-24 object-contain" />
            <h1 className="text-2xl font-semibold text-gray-900 mt-3">
              Admin Register
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Create your admin account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* FIRST NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="John"
                />
              </div>
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link className="text-green-600 font-medium hover:underline" to="/login">
              Login
            </Link>
          </p>

        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;


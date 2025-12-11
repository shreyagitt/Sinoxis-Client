import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hook";
import { loginSuccess } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApi";
import Layout from "../Components/layout/Layout";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const { user, token, refreshToken } = response.data;

      dispatch(loginSuccess({ user, token, refreshToken }));

      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      toast.success("Login Successful!");

      if (user.role === "admin") navigate("/dashboard");
      else navigate("/client/dashboard");

    } catch (error: any) {
      toast.error(error?.data?.error || "Invalid email or password.");
    }
  };

  return (
    <Layout hideChrome>
      <div className="min-h-screen flex justify-center items-center 
        bg-[#FFFFFF] dark:bg-[#020726] transition-colors px-4">

        <div className="
          max-w-md w-full 
          bg-white dark:bg-[#0B1029] 
          shadow-xl rounded-xl p-8 
          border border-[#1A2347] 
          transition-colors
        ">

          {/* LOGO + TITLE */}
          <div className="text-center mb-6">
            <img
              src="/image/group.jpeg"
              alt="Admin"
              className="mx-auto w-24 h-24 object-contain rounded-full border border-[#1A2347]"
            />

            <h1 className="text-2xl font-semibold text-[#020726] dark:text-white mt-3">
              Admin Login
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Sign in to access the admin panel
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* EMAIL FIELD */}
            <div>
              <label className="text-sm font-medium text-[#020726] dark:text-gray-200">Email</label>

              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="
                    w-full pl-10 pr-3 py-2 rounded-lg
                    bg-white dark:bg-[#111A3A]
                    border border-[#1A2347]
                    text-[#020726] dark:text-white
                    focus:ring-2 focus:ring-[#0288D1] outline-none
                  "
                  placeholder="admin@example.com"
                />
              </div>

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="text-sm font-medium text-[#020726] dark:text-gray-200">
                Password
              </label>

              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="
                    w-full pl-10 pr-10 py-2 rounded-lg
                    bg-white dark:bg-[#111A3A]
                    border border-[#1A2347]
                    text-[#020726] dark:text-white
                    focus:ring-2 focus:ring-[#0288D1] outline-none
                  "
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-[#0288D1]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-2 rounded-lg text-white font-medium
                bg-gradient-to-r from-[#29B6F6] to-[#0288D1]
                hover:opacity-90 transition
                disabled:opacity-50
              "
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

        </div>
      </div>
    </Layout>
  );
};

export default Login;

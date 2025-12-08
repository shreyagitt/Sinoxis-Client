import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hook";
import { loginSuccess } from "../features/auth/authSlice";
import { useLoginMutation, useRegisterMutation } from "../features/auth/authApi"; 
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

  // ⭐ Admin Login API
  const [login, { isLoading }] = useLoginMutation();


  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      console.log("LOGIN SUCCESS:", response);

      const { user, token, refreshToken } = response.data;

      // Save in Redux
      dispatch(loginSuccess({ user, token, refreshToken }));

      // Save token
      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      toast.success("Login Successful!");

      // ⭐ Redirect based on role
      if (user.role === "admin") navigate("/dashboard");
      else navigate("/client/dashboard");

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      toast.error(error?.data?.error || "Invalid email or password.");
    }
  };

  return (
    <Layout hideChrome>
      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">

          <div className="text-center mb-6">
            <img
              src="/image/logo.webp"
              alt="Admin"
              className="mx-auto w-24 h-24 object-contain"
            />
            <h1 className="text-2xl font-semibold text-gray-900 mt-3">
              Admin Login
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to access the admin panel
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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

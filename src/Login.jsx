import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { registerForPushNotifications } from "./services/notification.service";

function Login(props) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    const onSubmit = async (data) => {
        setLoading(true);
        setServerError("");

        try {
            const response = await axios.post(
                "https://kisanai-backend-c6a7.onrender.com/auth/signin",
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(
                "Login Success:",
                response.data
            );

            const {
                accessToken,
                user,
            } = response.data;

            // 1. Save JWT
            localStorage.setItem(
                "accessToken",
                accessToken
            );

            // 2. Save user
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // 3. Register FCM
            await registerForPushNotifications();

            // 4. Go to Home
            navigate("/");

        } catch (error) {
            console.error(
                "Login Error:",
                error
            );

            setServerError(
                error.response?.data?.error ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };



    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const { data } = await axios.post(
                "https://kisanai-backend-c6a7.onrender.com/auth/google",
                {
                    idToken: credentialResponse.credential,
                },
                { withCredentials: true }
            );
            console.log("Login Success:", data);
        } catch (error) {
            console.error("Google Login Failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">

                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Sign In
                </h2>

                {/* Server Error Alert */}
                {serverError && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className={`w-full rounded-md border p-2.5 outline-none transition text-black ${errors.username ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                }`}
                            {...register("email", {
                                required: "email is required",
                                minLength: { value: 3, message: "Username must be at least 3 characters" }
                            })}
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full rounded-md border p-2.5 outline-none transition text-black ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                }`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 p-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                </form>
                <div className="flex items-center justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            console.log("Google Login Failed");
                        }}
                        useOneTap
                        theme="outline"
                        size="large"
                        shape="pill"
                        text="signin_with"
                        width="300"
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
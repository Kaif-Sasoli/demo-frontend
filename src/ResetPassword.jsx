import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

function ResetPassword() {

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {

        if (!token) {
            alert("Invalid or missing reset token");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/auth/reset-password",
                {
                    token: token,
                    password: data.password,
                }
            );

            console.log(response.data);

            alert("Password reset successfully!");

        } catch (error) {

            console.error(error);
            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">

                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-7 w-7 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Invalid Reset Link
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        This password reset link is missing or invalid.
                        Please request a new password reset link.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md">

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    {/* Header */}
                    <div className="text-center mb-8">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

                            <svg
                                className="h-8 w-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v1h8z"
                                />
                            </svg>

                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Reset Password
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Enter your new password below.
                        </p>

                    </div>


                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >

                        {/* New Password */}
                        <div>

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                New Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter new password"
                                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                                    ${errors.password
                                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                                        : "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                    }
                                `}
                                {...register("password", {
                                    required: "Password is required",

                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 8 characters",
                                    },
                                })}
                            />

                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.password.message}
                                </p>
                            )}

                        </div>


                        {/* Password requirements */}
                        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">

                            <p className="text-xs font-medium text-gray-700 mb-1">
                                Password requirements
                            </p>

                            <p className="text-xs text-gray-500">
                                • At least 8 characters
                            </p>

                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white
                                transition hover:bg-green-700
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                                disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Resetting Password..."
                                : "Reset Password"}
                        </button>

                    </form>

                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    If you didn't request a password reset, you can safely
                    ignore this page.
                </p>

            </div>

        </div>
    );
}

export default ResetPassword;
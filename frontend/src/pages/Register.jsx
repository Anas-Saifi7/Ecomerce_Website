import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (formData.name.trim().length < 2) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.email) {
            setError("Please enter your email address.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const user = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
        };

        // Save logged-in user
        localStorage.setItem("Halla_user", JSON.stringify(user));

        //:Save registered account for frontend demo
        const registeredUsers = JSON.parse(
            localStorage.getItem("Halla_registered_users") || "[]"
        );

        const existingUser = registeredUsers.find(
            (item) =>
                item.email.toLowerCase() ===
                formData.email.trim().toLowerCase()
        );

        if (!existingUser) {
            registeredUsers.push({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            localStorage.setItem(
                "Halla Bol_registered_users",
                JSON.stringify(registeredUsers)
            );
        }

        const from = location.state?.from?.pathname || "/";

        // Redirect after registration
        setTimeout(() => {
            setLoading(false);
            navigate(from, { replace: true });
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4 py-6">

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">

                <div className="text-center mb-8">

                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                        Create Account
                    </h1>

                    <p className="mt-3 text-sm text-gray-500 leading-6">
                        Join Halla Bol and enjoy better shopping
                        <br className="hidden sm:block" />
                        experience.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#245d24] transition"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#245d24] transition"
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showConfirmPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#245d24] hover:bg-[#1c4d1c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition duration-200"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="flex items-center gap-3 my-6">

                    <div className="flex-1 h-px bg-gray-200"></div>

                    <span className="text-xs text-gray-400">
                        OR
                    </span>

                    <div className="flex-1 h-px bg-gray-200"></div>

                </div>

                {/* Google */}
                <button
                    type="button"
                    className="w-full border border-gray-300 bg-white hover:bg-gray-50 py-3 rounded-lg text-sm font-medium text-gray-700 transition"
                >
                    Continue with Google
                </button>

                {/* Login */}
                <p className="text-center text-sm text-gray-500 mt-7">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        state={{
                            from: location.state?.from,
                        }}
                        className="text-[#245d24] font-semibold hover:underline"
                    >
                        Login here
                    </Link>

                </p>

                <p className="text-center text-[11px] text-gray-400 mt-5 leading-5">
                    By creating an account, you agree to our Terms of
                    Service and Privacy Policy.
                </p>

            </div>

        </div>
    );
};

export default Register;
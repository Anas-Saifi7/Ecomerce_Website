import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    forgotPassword(cleanEmail)
      .then((data) =>
        setMessage(
          data.message || "If the account exists, a reset link has been sent.",
        ),
      )
      .catch((err) =>
        setError(err.message || "Unable to request a password reset."),
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Reset Your Password
          </h1>

          <p className="mt-3 text-sm text-gray-500 leading-6">
            Enter your email address and we'll help you
            <br className="hidden sm:block" />
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setMessage("");
              }}
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 text-center">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#245d24] hover:bg-[#1c4d1c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition duration-200"
          >
            {loading ? "Checking Email..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-7">
          <Link
            to="/login"
            className="text-sm text-[#245d24] font-semibold hover:underline"
          >
            ← Back to Login
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#245d24] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

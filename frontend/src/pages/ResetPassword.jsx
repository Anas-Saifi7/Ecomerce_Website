import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword as submitPasswordReset } from "../services/authService.js";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password", { replace: true });
      return;
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await submitPasswordReset(token, password);
      setSuccess("Your password has been updated successfully.");
      setTimeout(() => navigate("/account", { replace: true }), 900);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Create New Password
          </h1>

          <p className="mt-3 text-sm text-gray-500 leading-6">
            Create a new secure password for
            <br />
            your Halla Bol account.
          </p>
        </div>

        <div className="mb-5">
          <p className="text-sm text-gray-600">
            This secure reset link is single-use and expires after 30 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#245d24]"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-[#245d24] focus:ring-2 focus:ring-green-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#245d24]"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 text-center">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#245d24] hover:bg-[#1c4d1c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition duration-200"
          >
            {loading ? "Updating Password..." : "Update Password"}
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
      </div>
    </div>
  );
};

export default ResetPassword;


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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (name.length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem("Halla Bol_registered_users") || "[]"
      );

      if (!Array.isArray(registeredUsers)) {
        throw new Error("Account information is invalid. Please try again.");
      }

      const existingUser = registeredUsers.find(
        (user) => user.email?.trim().toLowerCase() === email
      );

      if (existingUser) {
        setError("This email is already registered. Please log in.");
        return;
      }

      const newUser = {
        name,
        email,
        password,
      };

      registeredUsers.push(newUser);

      localStorage.setItem(
        "Halla Bol_registered_users",
        JSON.stringify(registeredUsers)
      );

      // Keep the authentication key consistent with Login and ProtectedRoute.
      localStorage.setItem(
        "Halla_user",
        JSON.stringify({ name, email })
      );

      const requestedPath = location.state?.from?.pathname;

      const destination =
        requestedPath &&
        requestedPath !== "/login" &&
        requestedPath !== "/register"
          ? requestedPath
          : "/check-out";

      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-gray-900">
            Create Your Account
            <br />
            with Halla Bol
          </h1>

          <p className="text-sm text-center text-gray-500 mt-3 leading-6">
            Join us and discover authentic products
            <br />
            inspired by India's rich heritage.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              minLength={3}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="h-4 w-4 accent-green-700"
            />
            Show password
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#245d24] hover:bg-[#1c4d1c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition duration-200"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="text-green-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <p className="text-center text-[11px] text-gray-400 mt-6 leading-5">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Register;

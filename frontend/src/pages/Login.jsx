
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
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

      const matchedUser = registeredUsers.find(
        (user) =>
          user.email?.trim().toLowerCase() === email &&
          user.password === password
      );

      if (!matchedUser) {
        setError("Invalid email or password. Please register first.");
        return;
      }

      const user = {
        name: matchedUser.name,
        email: matchedUser.email,
      };

      // Use the same key as ProtectedRoute.jsx.
      localStorage.setItem("Halla_user", JSON.stringify(user));

      const requestedPath = location.state?.from?.pathname;

      const destination =
        requestedPath &&
        requestedPath !== "/login" &&
        requestedPath !== "/register"
          ? requestedPath
          : "/check-out";

      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-center text-gray-900">
            Welcome Back
            <br />
            to Halla Bol
          </h1>

          <p className="text-sm text-center text-gray-500 mt-3 leading-6">
            Login to your account and continue
            <br />
            your natural journey with us.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
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
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-green-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#245d24] hover:bg-[#1c4d1c] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={() =>
            setError("Google sign-in has not been configured yet.")
          }
          className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition text-sm"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-7">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={location.state}
            className="text-green-700 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>

        <p className="text-center text-[11px] text-gray-400 mt-6 leading-5">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;

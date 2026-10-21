import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(email.trim().toLowerCase(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <div className="text-center mb-8">
          <p className="text-[#d8b75a] text-3xl mb-2">◇</p>
          <h1 className="font-serif text-3xl font-bold text-[#073b25]">
            Halla Bol Admin
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in with admin or manager credentials
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#073b25] focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#073b25] focus:ring-2 focus:ring-green-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#073b25] hover:bg-[#052a1a] disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-lg transition"
          >
            {loading ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link
           to="/"
            className="text-[#073b25] font-semibold hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser } from "../redux/userSlice";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { API_BASE_URL } from "../config";

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await axios.post(`${API_BASE_URL}/auth/signin`, credentials, { withCredentials: true });
      await dispatch(getCurrentUser());
      navigate("/home");
    } catch (error) {
      setErr(error.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient header line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center border border-zinc-700/50">
                <LogIn className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="text-zinc-500 mt-2 text-sm text-center">Sign in to continue to your account</p>
            </div>

            {/* Error message */}
            {err && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm text-center">{err}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-zinc-400">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner /> : "Sign In"}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="grow border-t border-zinc-800"></div>
                <span className="shrink mx-4 text-zinc-600 text-sm">or continue with</span>
                <div className="grow border-t border-zinc-800"></div>
              </div>

              {/* Google button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.691 1.245 6.655l4.021 3.11z" />
                  <path fill="#34A853" d="M16.04 18.013c-1.09.593-2.325.896-3.618.896-3.323 0-6.141-2.274-7.147-5.327l-4.041 3.12C3.186 21.353 7.27 24 12 24c3.055 0 5.777-1.025 7.727-2.771l-3.687-3.216z" />
                  <path fill="#4285F4" d="M19.727 21.229C22.25 18.96 23.818 15.636 23.818 12c0-.859-.077-1.691-.223-2.509H12v4.8h6.618a5.645 5.645 0 0 1-2.454 3.7l3.563 3.238z" />
                  <path fill="#FBBC05" d="M5.275 14.225A7.086 7.086 0 0 1 4.909 12c0-.773.11-1.514.314-2.214L1.2 6.666A11.914 11.914 0 0 0 0 12c0 1.92.455 3.732 1.264 5.336l4.011-3.111z" />
                </svg>
                <span>Google</span>
              </button>

              {/* Sign up link */}
              <p className="text-center text-zinc-500 text-sm mt-8">
                New here?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Create an account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;

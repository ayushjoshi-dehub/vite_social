import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../redux/userSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    age: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
        const res = await axios.post("http://localhost:8000/api/auth/signup", formData, { withCredentials: true });
        console.log(res.data.message);
        await dispatch(getCurrentUser());
        navigate("/home");
    } catch (err) {
        const errorMsg = err.response?.data?.message || "Signup failed";
        console.error(errorMsg);
        setErr(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030303] flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- Animated Background Blobs --- */}
      {/* These create the "attractive" depth you're looking for */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />

      {/* --- Glassmorphism Card --- */}
      <div className="relative z-10 w-full max-w-md">
        {/* Decorative outer glow/border */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-zinc-700/50 to-transparent rounded-[2.5rem] blur-sm opacity-50"></div>
        
        <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.4rem] shadow-2xl">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 mb-4 bg-zinc-800/50 p-3 rounded-2xl border border-zinc-700/50 shadow-inner">
              <img 
                src="logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Join our community today.</p>
          </div>

          {err && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />

              <div className="flex gap-3">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:border-b-gray-400 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-4 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Get Started"}
            </button>

            <p className="text-sm text-zinc-500 text-center mt-6">
              Already have an account?{" "}
              <a href="/signin" className="text-white hover:underline font-medium transition-colors">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

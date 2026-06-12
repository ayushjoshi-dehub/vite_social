import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { 
  Mail, 
  Lock, 
  Key, 
  CheckCircle, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  RefreshCw,
  Shield
} from "lucide-react";

const Requirement = ({ label, met }) => (
  <motion.div 
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2"
  >
    <div className={`relative`}>
      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
        met ? "bg-emerald-400" : "bg-zinc-600"
      }`}>
        {met && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-400"
          />
        )}
      </div>
    </div>
    <span className={`text-xs font-medium ${
      met ? "text-emerald-400" : "text-zinc-500"
    }`}>
      {label}
    </span>
  </motion.div>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ProgressBar = ({ step }) => {
  const steps = [
    { icon: Mail, label: "Email" },
    { icon: Key, label: "Verify" },
    { icon: Lock, label: "Reset" },
    { icon: CheckCircle, label: "Done" }
  ];

  return (
    <div className="flex justify-between mb-8 px-2">
      {steps.map((s, idx) => {
        const StepIcon = s.icon;
        const isActive = step > idx;
        const isCurrent = step === idx + 1;
        
        return (
          <div key={idx} className="flex flex-col items-center relative">
            <div className={`z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
              isActive || isCurrent
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                : "bg-zinc-800 border border-zinc-700"
            }`}>
              <StepIcon className={`w-5 h-5 ${
                isActive || isCurrent ? "text-white" : "text-zinc-500"
              }`} />
            </div>
            <span className={`text-xs mt-2 font-medium ${
              isActive || isCurrent ? "text-white" : "text-zinc-600"
            }`}>
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className={`absolute top-5 left-[60%] w-[calc(100%-40px)] h-[2px] transition-colors duration-300 ${
                step > idx + 1 ? "bg-blue-500" : "bg-zinc-800"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPass, setShowPass] = useState({ new: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const serverUrl = API_BASE_URL.replace(/\/api$/, "");

  const handleStep1 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "User not found or Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp: otpString }, { withCredentials: true });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or Expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setResendLoading(true);
    setError("");
    try {
      await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
      setCooldown(30);
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (strength < 3) {
      setError("Please choose a stronger password");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword: passwords.new }, { withCredentials: true });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(passwords.new);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    { bg: "bg-red-500", text: "text-red-400" },
    { bg: "bg-orange-500", text: "text-orange-400" },
    { bg: "bg-yellow-500", text: "text-yellow-400" },
    { bg: "bg-emerald-500", text: "text-emerald-400" }
  ];

  const isMatching = passwords.new === passwords.confirm && passwords.new !== "";

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000" />
      </div>

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="p-8">
            {/* Progress bar */}
            <ProgressBar step={step} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                  >
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {/* Step 1 - Email */}
                {step === 1 && (
                  <form onSubmit={handleStep1} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Spinner /> : "Send Reset Code"}
                    </button>

                    <p className="text-center text-zinc-500 text-sm">
                      Remember your password?{" "}
                      <button
                        type="button"
                        onClick={() => window.location.href = '/signin'}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                )}

                {/* Step 2 - OTP */}
                {step === 2 && (
                  <form onSubmit={handleStep2} className="space-y-6">
                    <div className="space-y-4">
                      <p className="text-center text-zinc-400 text-sm">
                        We've sent a verification code to
                        <br />
                        <span className="text-white font-medium">{email}</span>
                      </p>

                      <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-12 h-14 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white text-center text-xl font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={isLoading || otp.some(d => !d)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Spinner /> : "Verify Code"}
                    </button>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Change Email
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendLoading || cooldown > 0}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3 - New Password */}
                {step === 3 && (
                  <form onSubmit={handleStep3} className="space-y-6">
                    <div className="space-y-4">
                      {/* New Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">New Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type={showPass.new ? "text" : "password"}
                            placeholder="Enter new password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-400">Confirm Password</label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type={showPass.confirm ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full pl-12 pr-12 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            {showPass.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Password strength indicator */}
                      {passwords.new && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1 flex-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                    level <= strength
                                      ? strengthColors[strength - 1]?.bg || "bg-zinc-700"
                                      : "bg-zinc-800"
                                  }`}
                                />
                              ))}
                            </div>
                            {strength > 0 && (
                              <span className={`text-xs font-medium ml-2 ${strengthColors[strength - 1]?.text || "text-zinc-500"}`}>
                                {strengthLabels[strength - 1]}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Requirement label="Min. 8 characters" met={passwords.new.length >= 8} />
                            <Requirement label="Uppercase letter" met={/[A-Z]/.test(passwords.new)} />
                            <Requirement label="Number" met={/[0-9]/.test(passwords.new)} />
                            <Requirement label="Special character" met={/[^A-Za-z0-9]/.test(passwords.new)} />
                          </div>
                        </div>
                      )}

                      {passwords.confirm && (
                        <div className={`flex items-center gap-2 text-sm ${
                          isMatching ? "text-emerald-400" : "text-red-400"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${isMatching ? "bg-emerald-400" : "bg-red-400"}`} />
                          <span>{isMatching ? "Passwords match" : "Passwords don't match"}</span>
                        </div>
                      )}
                    </div>

                    <button
                      disabled={!isMatching || strength < 3 || isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Spinner /> : "Reset Password"}
                    </button>
                  </form>
                )}

                {/* Step 4 - Success */}
                {step === 4 && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6 text-center"
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/30"
                      >
                        <CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6"
                      >
                        <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
                        <p className="text-zinc-400 mb-8">
                          Your password has been successfully updated.
                        </p>
                      </motion.div>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => window.location.href = '/signin'}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Continue to Sign In
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
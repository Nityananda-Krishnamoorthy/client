import React, { useState, useEffect } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const [tokenValid, setTokenValid] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid reset link");
    } else {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/validate-reset-token/${token}`);
      if (!response.data.valid) {
        setTokenValid(false);
        setError("This reset link has expired or is invalid");
      }
    } catch {
      setTokenValid(false);
      setError("Failed to verify reset link. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("This reset link has expired or is invalid");
        setTokenValid(false);
      } else {
        setError(err.response?.data?.message || "Password reset failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !tokenValid) {
      navigate("/forgot-password", { replace: true });
    }
  }, [token, tokenValid]);

  if (!tokenValid) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Reset Link</h2>
          <p className="text-sm mt-2 text-gray-600">{error || "The reset link is invalid or has expired."}</p>
          <p className="text-sm mt-1 text-gray-500">Please request a new password reset link.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Request New Link
          </button>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-green-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-green-700">Password Reset!</h2>
          <p className="text-sm mt-2 text-gray-600">Your password has been successfully updated.</p>
          <p className="text-sm mt-1 text-gray-500">You will be redirected to login shortly.</p>
        </div>
      </section>
    );
  }

  return (
  <section className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
   <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Brand Panel */}
        <div className="bg-cyan-500 text-white p-8 hidden md:flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-2">NEXIS</h1>
          <p className="text-lg text-center">Create a New Password Now</p>
        </div>


     {/* Right Form Panel */}
    <div className="p-6 sm:p-8 md:p-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reset Password</h2>
        {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
            <p className="text-sm text-red-600">{error}</p>
        )}

      <div className="relative">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <div className="relative ">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            id="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="••••••••"
            required
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative ">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaLock />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full pl-10 pr-10 border rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="••••••••"
            required
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p className="mb-1">Your password must:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Be at least 8 characters long</li>
          <li>Contain uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 rounded-md transition-colors text-white ${
            isLoading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
        }`}
    >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      <p className="text-sm text-center text-gray-600">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-cyan-600 hover:underline"
        >
          Back to Login
        </button>
      </p>
    </form>

    <p className="text-xs text-gray-500 text-center mt-6">
      By resetting your password, you agree to our{" "}
    <a href="#" className="underline text-indigo-500">Terms of Service</a> and{' '}
    <a href="#" className="underline text-indigo-500">Privacy Policy</a>.
    </p>
  </div>
  </div>
</section>

  );
};

export default ResetPassword;

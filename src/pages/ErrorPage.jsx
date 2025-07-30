import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4 py-6">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-blue-200 relative">
        <button
          className="absolute top-2 left-4 text-sm text-blue-600 hover:underline flex items-center"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>

        <h1 className="text-4xl font-bold text-blue-600 mb-2">🚧 Under Development 🚀</h1>
        <p className="text-lg text-gray-700 mb-4">
          This page is currently being built with{" "}
          <span className="font-semibold text-indigo-600">futuristic AI features</span>.
        </p>
        <p className="text-md text-gray-500">
          We're cooking something amazing! Please check back later. 🤖✨
        </p>
        <div className="mt-6">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-600 text-sm px-4 py-1">
            AI-Powered Feature Coming Soon!
          </span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;

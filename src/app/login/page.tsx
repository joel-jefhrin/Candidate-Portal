"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Call admin portal API to authenticate
      const response = await fetch(`${API_URL}/auth/candidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          tempPassword: tempPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        toast.error(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Store candidate session
      sessionStorage.setItem('candidateId', data.id);
      sessionStorage.setItem('candidateEmail', data.email);
      sessionStorage.setItem('candidateName', `${data.firstName} ${data.lastName}`);
      sessionStorage.setItem('campaignId', data.campaignId);
      sessionStorage.setItem('campaignName', data.campaign.name);
      
      // Store candidate data as JSON
      sessionStorage.setItem('candidateData', JSON.stringify(data));

      toast.success(`Welcome ${data.firstName}! Starting your interview...`);
      
      // Check if interview already completed
      if (data.status === 'completed') {
        router.push("/results");
      } else {
        // Update status to in_progress if not started
        if (data.status === 'not_started' || data.status === 'invited') {
          // Update status via API (optional)
          // For now, just redirect to interview
        }
        router.push("/interview");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please try again.');
      toast.error('Connection error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <AcademicCapIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Candidate Portal
          </h1>
          <p className="text-gray-600 mt-2">Login to start your interview</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="input"
              />
            </div>

            <div>
              <label htmlFor="tempPassword" className="label">Temporary Password</label>
              <div className="relative">
                <input
                  id="tempPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter the password sent to you"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Check your email for the temporary password provided by the administrator
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Authenticating...
                </span>
              ) : (
                'Start Interview'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a href="mailto:support@demo.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">ℹ️ Important Information:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Your credentials are sent to your email by the administrator</li>
              <li>• Each candidate has a unique temporary password</li>
              <li>• Make sure to complete your interview within the allotted time</li>
              <li>• Your progress is auto-saved every 30 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

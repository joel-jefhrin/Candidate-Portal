"use client";

import { CheckCircleIcon, HomeIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InterviewCompletePage() {
  const [timeTaken, setTimeTaken] = useState<number>(0);

  useEffect(() => {
    const timeTakenStr = sessionStorage.getItem('interviewTimeTaken');
    if (timeTakenStr) {
      setTimeTaken(parseInt(timeTakenStr));
    }
  }, []);

  const formatTime = (minutes: number) => {
    if (minutes === 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full">
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Interview Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for completing your interview. Your responses have been recorded.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h2>
            <div className="space-y-3 text-left text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">1.</span>
                <p>Your answers will be evaluated by our system and review team</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">2.</span>
                <p>You'll receive an email with your results within 3-5 business days</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">3.</span>
                <p>If you pass, we'll contact you for the next round of interviews</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="card p-4 bg-gray-50">
              <p className="text-sm text-gray-600">Questions Answered</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3 / 3</p>
            </div>
            <div className="card p-4 bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">Time Taken</p>
              </div>
              <p className="text-2xl font-bold text-blue-900 text-center">
                {formatTime(timeTaken)}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Your interview ID: <span className="font-mono font-semibold text-gray-900">INT-2024-001</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/results"
              className="btn bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 inline-flex items-center gap-2 justify-center"
            >
              <ChartBarIcon className="w-5 h-5" />
              View Results & Ranking
            </Link>
            <Link 
              href="/login" 
              className="btn-outline inline-flex items-center gap-2 justify-center"
            >
              <HomeIcon className="w-5 h-5" />
              Back to Login
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Questions? Email us at{" "}
            <a href="mailto:support@demo.com" className="text-blue-600 hover:underline">
              support@demo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


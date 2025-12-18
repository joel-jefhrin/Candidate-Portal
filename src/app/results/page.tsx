"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const [candidateId, setCandidateId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem('candidateId');
    if (!id) {
      router.push('/login');
    } else {
      setCandidateId(id);
    }
  }, [router]);

  const getTimeTaken = () => {
    const timeTaken = sessionStorage.getItem('interviewTimeTaken');
    if (timeTaken) {
      return parseInt(timeTaken);
    }
    const startTime = sessionStorage.getItem('interviewStartTime');
    if (startTime) {
      const elapsed = Date.now() - parseInt(startTime);
      return Math.floor(elapsed / 60000);
    }
    return 0;
  };

  const result = {
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    campaign: 'Frontend Developer Hiring',
    rank: 1,
    totalCandidates: 75,
    scores: {
      technical: 95,
      behavioral: 90,
      logical: 88,
      total: 92.8,
    },
    passingScore: 70,
    status: 'passed' as const,
    timeTaken: getTimeTaken(),
    completedAt: new Date().toISOString(),
    breakdown: [
      { question: 'Implement Binary Search', score: 95, maxScore: 100 },
      { question: 'Explain React Hooks', score: 48, maxScore: 50 },
      { question: 'JavaScript Data Types', score: 23, maxScore: 25 },
    ],
  };

  const percentile = ((result.totalCandidates - result.rank + 1) / result.totalCandidates * 100).toFixed(1);

  if (!candidateId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Interview Results
          </h1>
          <p className="text-gray-600 mt-1">{result.campaign}</p>
        </div>

        <div className={`card p-6 mb-6 ${
          result.status === 'passed' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500'
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              result.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {result.status === 'passed' ? (
                <CheckCircleIcon className="w-10 h-10 text-white" />
              ) : (
                <XCircleIcon className="w-10 h-10 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {result.status === 'passed' ? 'Congratulations! You Passed! 🎉' : 'Interview Completed'}
              </h2>
              <p className="text-gray-700 mt-1">
                {result.status === 'passed' 
                  ? `You scored ${result.scores.total}% - Above the passing score of ${result.passingScore}%`
                  : `You scored ${result.scores.total}% - Below the passing score of ${result.passingScore}%`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <TrophyIcon className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Your Rank</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">#{result.rank}</p>
            <p className="text-xs text-gray-600 mt-1">out of {result.totalCandidates}</p>
          </div>

          <div className="card p-6 text-center">
            <ChartBarIcon className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Score</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{result.scores.total}%</p>
            <p className="text-xs text-gray-600 mt-1">Combined average</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-green-600">%</span>
            </div>
            <p className="text-sm text-gray-600">Percentile</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{percentile}th</p>
            <p className="text-xs text-gray-600 mt-1">Better than others</p>
          </div>

          <div className="card p-6 text-center">
            <ClockIcon className="w-10 h-10 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Time Taken</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {result.timeTaken > 0 ? result.timeTaken : '-'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {result.timeTaken > 0 ? 'minutes' : 'Not available'}
            </p>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills Breakdown</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Technical Skills</span>
                <span className="text-lg font-bold text-gray-900">{result.scores.technical}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${result.scores.technical}%` }}
                >
                  <span className="text-xs text-white font-semibold">{result.scores.technical}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Programming, algorithms, system design</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Behavioral Skills</span>
                <span className="text-lg font-bold text-gray-900">{result.scores.behavioral}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${result.scores.behavioral}%` }}
                >
                  <span className="text-xs text-white font-semibold">{result.scores.behavioral}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Communication, teamwork, problem-solving</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Logical Skills</span>
                <span className="text-lg font-bold text-gray-900">{result.scores.logical}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${result.scores.logical}%` }}
                >
                  <span className="text-xs text-white font-semibold">{result.scores.logical}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Analytical thinking, reasoning</p>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Question-wise Performance</h3>
          <div className="space-y-3">
            {result.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.question}</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-lg font-bold text-gray-900">{item.score}</p>
                  <p className="text-xs text-gray-600">/ {item.maxScore}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 bg-blue-50 border border-blue-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
          <div className="space-y-3 text-sm text-gray-700">
            {result.status === 'passed' ? (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  You will be contacted for the next round of interviews within 3-5 business days
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Check your email for further instructions and interview schedule
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Prepare for technical and HR interviews with our hiring team
                </p>
              </>
            ) : (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Thank you for your time and effort in this interview
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  We encourage you to apply again in the future after gaining more experience
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Check out our learning resources to improve your skills
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 flex-1 justify-center"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Login
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-outline flex-1"
          >
            🖨️ Print Results
          </button>
        </div>
      </div>
    </div>
  );
}


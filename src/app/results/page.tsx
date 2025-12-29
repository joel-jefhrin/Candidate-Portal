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

type ResultData = {
  candidate: {
    name: string;
    email: string;
  };
  campaign: string;
  rank: number;
  totalCandidates: number;
  scores: {
    technical: number;
    behavioral: number;
    logical: number;
    total: number;
  };
  passingScore: number;
  status: "passed" | "failed";
  completedAt: string;
  breakdown: {
    question: string;
    score: number;
    maxScore: number;
  }[];
};

export default function ResultsPage() {
  const router = useRouter();
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Get candidateId from sessionStorage
  useEffect(() => {
    const id = sessionStorage.getItem("candidateId");
    if (!id) {
      router.push("/login");
    } else {
      setCandidateId(id);
    }
  }, [router]);

  // 🔹 Fetch results from API
  useEffect(() => {
    if (!candidateId) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/results?candidateId=${candidateId}`
        );

        if (!res.ok) throw new Error("Failed to fetch results");

        const data: ResultData = await res.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [candidateId]);

  // 🔹 Calculate interview time taken
  const getTimeTaken = () => {
    const stored = sessionStorage.getItem("interviewTimeTaken");
    if (stored) return parseInt(stored);

    if (!result) return 0;

    const start = sessionStorage.getItem("interviewStartTime");
    if (!start) return 0;

    const elapsed = new Date(result.completedAt).getTime() - parseInt(start);
    return Math.max(Math.floor(elapsed / 60000), 0);
  };

  if (loading) return <div className="p-6">Loading results...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!result) return <div className="p-6">No results found.</div>;

  const percentile = (
    ((result.totalCandidates - result.rank + 1) / result.totalCandidates) *
    100
  ).toFixed(1);
  const timeTaken = getTimeTaken();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <Link
            href="/login"
            className="text-sm text-blue-600 flex items-center gap-2 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Your Interview Results
          </h1>
          <p className="text-gray-700">{result.campaign}</p>
          <p className="text-gray-500 mt-1">
            Candidate: {result.candidate.name}
          </p>
        </div>

        {/* STATUS CARD */}
        <div
          className={`card p-6 mb-6 ${
            result.status === "passed"
              ? "bg-green-50 border-2 border-green-500"
              : "bg-red-50 border-2 border-red-500"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                result.status === "passed" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {result.status === "passed" ? (
                <CheckCircleIcon className="w-10 h-10 text-white" />
              ) : (
                <XCircleIcon className="w-10 h-10 text-white" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {result.status === "passed"
                  ? "Congratulations! You Passed 🎉"
                  : "Interview Completed"}
              </h2>
              <p className="text-gray-700">
                Score: {result.scores.total}% (Pass mark {result.passingScore}%)
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Rank"
            value={`#${result.rank}`}
            subtitle={`out of ${result.totalCandidates}`}
            icon={<TrophyIcon />}
          />
          <StatCard
            title="Total Score"
            value={`${result.scores.total}%`}
            icon={<ChartBarIcon />}
          />
          <StatCard title="Percentile" value={`${percentile}th`} />
          <StatCard
            title="Time Taken"
            value={timeTaken > 0 ? `${timeTaken}` : "-"}
            subtitle="minutes"
            icon={<ClockIcon />}
          />
        </div>

        {/* QUESTION BREAKDOWN */}
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Question-wise Performance
          </h3>
          <div className="space-y-3">
            {result.breakdown.map((q, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{q.question}</p>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(q.score / q.maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {q.score} / {q.maxScore}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="btn bg-blue-600 text-white flex-1 flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-5 h-5" /> Back to Login
          </Link>
          <button onClick={() => window.print()} className="btn-outline flex-1">
            🖨️ Print Results
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="card p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
      {icon && <div className="w-10 h-10 mx-auto mb-2">{icon}</div>}
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

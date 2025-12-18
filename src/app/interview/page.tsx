"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClockIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Question {
  id: string;
  title: string;
  description: string;
  answerType: string;
  marks: number;
  options?: string[];
  codeTemplate?: string;
  rubric?: string;
  fileTypes?: string[];
  ratingScale?: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  durationPerCandidate: number;
  questionsPerCandidate: number;
  passingScore: number;
}

export default function InterviewPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      const candidateId = sessionStorage.getItem('candidateId');
      
      if (!candidateId) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/candidates/${candidateId}/questions`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        
        setQuestions(data.questions);
        setCampaign(data.campaign);
        setTimeRemaining(data.campaign.durationPerCandidate * 60); // Convert minutes to seconds
        
        // Store interview start time
        if (!sessionStorage.getItem('interviewStartTime')) {
          sessionStorage.setItem('interviewStartTime', startTime.toString());
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load interview questions');
        router.push("/login");
      }
    };

    fetchQuestions();
  }, [router, startTime]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === 0 || isLoading) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        
        if (prev === 300) {
          toast.error("⚠️ Only 5 minutes remaining!");
        }
        
        if (prev === 60) {
          toast.error("⚠️ Only 1 minute remaining!");
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isLoading]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [answers]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    localStorage.setItem('interview_answers', JSON.stringify(answers));
    setLastSaved(new Date());
    toast.success("Progress saved", { duration: 1000 });
  };

  const calculateTimeTaken = () => {
    const startTimeStr = sessionStorage.getItem('interviewStartTime');
    if (startTimeStr) {
      const start = parseInt(startTimeStr);
      const elapsed = Date.now() - start;
      const minutes = Math.floor(elapsed / 60000);
      return minutes;
    }
    return 0;
  };

  const submitInterview = async () => {
    const candidateId = sessionStorage.getItem('candidateId');
    const startTimeStr = sessionStorage.getItem('interviewStartTime');
    const timeTaken = calculateTimeTaken();
    
    try {
      const response = await fetch(`${API_URL}/candidates/${candidateId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: answers,
          interviewStartedAt: startTimeStr,
          interviewCompletedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit interview');
      }

      sessionStorage.setItem('interviewTimeTaken', timeTaken.toString());
      return true;
    } catch (error) {
      console.error('Error submitting interview:', error);
      toast.error('Failed to submit interview. Please try again.');
      return false;
    }
  };

  const handleAutoSubmit = async () => {
    toast.error("Time's up! Auto-submitting your interview...");
    const success = await submitInterview();
    if (success) {
      setTimeout(() => {
        router.push("/interview/complete");
      }, 2000);
    }
  };

  const handleSubmit = async () => {
    if (confirm("Are you sure you want to submit? You cannot change answers after submission.")) {
      setIsSubmitting(true);
      handleSave();
      const success = await submitInterview();
      if (success) {
        toast.success("Interview submitted successfully!");
        setTimeout(() => {
          router.push("/interview/complete");
        }, 1500);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout? Your progress will be saved.")) {
      handleSave();
      sessionStorage.clear();
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your interview...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            There are no questions assigned to your interview campaign yet. Please contact the administrator.
          </p>
          <button onClick={() => router.push("/login")} className="btn-outline">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-blue-200 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {campaign?.name || 'Interview'}
                </h1>
                <p className="text-xs text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <ClockIcon className="w-5 h-5" />
                <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              </div>

              {lastSaved && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="btn-outline text-sm flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Save & Exit</span>
              </button>
            </div>
          </div>

          <div className="h-1.5 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Questions</h3>
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : answers[q.id]
                        ? 'bg-green-100 text-green-900 border border-green-300'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Q{index + 1}</span>
                      {answers[q.id] && (
                        <CheckCircleIcon className="w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs mt-1 opacity-90 truncate">{q.title}</p>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">
                    {Object.keys(answers).length}/{questions.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-semibold">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="badge badge-gray capitalize">
                      {currentQuestion.answerType.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      {currentQuestion.marks} points
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentQuestion.title}
                  </h2>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {currentQuestion.description}
              </p>

              <div className="bg-gray-50 rounded-lg p-6 min-h-[300px]">
                {currentQuestion.answerType === 'code_editor' && (
                  <div>
                    <label className="label">Your Code Solution</label>
                    <textarea
                      value={answers[currentQuestion.id] || currentQuestion.codeTemplate || ''}
                      onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                      className="input font-mono text-sm"
                      rows={15}
                      placeholder={currentQuestion.codeTemplate || "// Write your code here"}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Write clean, well-commented code. Consider edge cases.
                    </p>
                  </div>
                )}

                {currentQuestion.answerType === 'essay' && (
                  <div>
                    <label className="label">Your Answer</label>
                    <textarea
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                      className="input"
                      rows={12}
                      placeholder="Type your detailed answer here..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Provide examples and explain your reasoning clearly.
                    </p>
                  </div>
                )}

                {currentQuestion.answerType === 'multiple_choice' && currentQuestion.options && (
                  <div>
                    <label className="label mb-3">Select the correct answer(s)</label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={(answers[currentQuestion.id] || []).includes(option)}
                            onChange={(e) => {
                              const current = answers[currentQuestion.id] || [];
                              const updated = e.target.checked
                                ? [...current, option]
                                : current.filter((a: string) => a !== option);
                              setAnswers({ ...answers, [currentQuestion.id]: updated });
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleSave}
                className="btn-outline"
              >
                💾 Save Progress
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
                >
                  Next
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Interview'}
                </button>
              )}
            </div>

            <div className="card p-4 bg-blue-50 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your progress is auto-saved every 30 seconds</li>
                <li>• You can navigate between questions freely</li>
                <li>• Make sure to answer all questions before submitting</li>
                <li>• Watch the timer - interview will auto-submit when time runs out</li>
                <li>• Passing score: {campaign?.passingScore}%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

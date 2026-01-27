import React from "react";
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award } from 'lucide-react'
import moment from 'moment';

const QuizCard = ({ quiz, onDelete }) => {

    return (
        <div className="relative w-full max-w-md rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-400/5 p-5 shadow-lg shadow-cyan-500/10 backdrop-blur transition-all duration-300 hover:border-cyan-400/60 hover:shadow-cyan-400/20">
            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quiz);
                }}
                className="absolute right-4 top-4 rounded-full p-2 text-cyan-300 transition hover:bg-cyan-400/10 hover:text-red-400"
            >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                        <Award className="h-4 w-4" strokeWidth={2.5} />
                        <span>Score: {quiz?.score}</span>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                    <h3
                        className="line-clamp-2 text-lg font-semibold tracking-wide text-cyan-100"
                        title={quiz.title}
                    >
                        {quiz.title || `Quiz - ${moment(quiz.createdAt).format("MMM DD YYYY")}`}
                    </h3>
                    <p className="text-xs text-cyan-300/70">
                        Created {moment(quiz.createdAt).format("MMM DD YYYY")}
                    </p>
                </div>

                {/* Quiz Info */}
                <div className="flex items-center justify-between text-sm text-cyan-200">
                    <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1">
                        {quiz.questions.length} {quiz.questions.length === 1 ? "Question" : "Questions"}
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-5">
                {quiz?.userAnswers?.length > 0 ? (
                    <Link to={`/quizzes/${quiz._id}/results`}>
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20">
                            <BarChart2 className="h-4 w-4" strokeWidth={2.5} />
                            View Results
                        </button>
                    </Link>
                ) : (
                    <Link to={`/quizzes/${quiz._id}`}>
                        <button className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-cyan-400/40 bg-cyan-500/10 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20">
                            <span className="relative z-10 flex items-center gap-2">
                                <Play className="h-4 w-4" strokeWidth={2.5} />
                                Start Quiz
                            </span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default QuizCard
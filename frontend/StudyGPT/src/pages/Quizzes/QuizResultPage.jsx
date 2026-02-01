import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from "lucide-react";


const QuizResultPage = () => {

    const { quizId } = useParams();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await quizService.getQuizResults(quizId);
                setResults(data);
            } catch (error) {
                toast.error('Failed to fetch quiz results.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [quizId]);

    if(loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        );
    }

    if(!results || !results.data){
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="px-8 py-6 rounded-2xl border border-cyan-400/40 bg-cyan-500/5 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                    <p className="text-cyan-300 text-lg font-semibold tracking-wide">
                        Quiz results not found.
                    </p>
                </div>
            </div>
        );
    }

    const { data: { quiz, results: detailedResults } } = results;
    const score = quiz.score;
    const totalQuestions = detailedResults.length;
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;

    const getScoreColor = (score) => {
        if(score >= 80) return 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]'
        if(score >= 60) return 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
        return 'text-cyan-200/80'
    };

    const getScoreMessage = (score) => {
        if(score >= 90) return 'Outstanding!';
        if(score >= 80) return 'Great Job!';
        if(score >= 70) return 'Good Work!';
        if(score >= 60) return 'Not Bad!';
        return 'Keep practicing!';
    };


    return (
        <div className="min-h-screen bg-black px-6 py-8">
    {/* Back Button */}
    <div className="mb-6">
        <Link
            to={`/documents/${quiz.document._id}`}
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-400 transition-all duration-200 group"
        >
            <ArrowLeft
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                strokeWidth={2}
            />
            <span className="tracking-wide text-sm font-medium">
                Back to Document
            </span>
        </Link>
    </div>

    <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

    {/* SCORE CARD */}
    <div className="mt-10 flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-cyan-400/30 bg-cyan-500/5 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.25)] px-8 py-8">
            
            {/* Top Row */}
            <div className="flex items-center gap-6">
                {/* Trophy */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/40">
                    <Trophy className="w-8 h-8 text-cyan-400" strokeWidth={2} />
                </div>

                {/* Score Column */}
                <div className="flex flex-col flex-1">
                    <p className="text-cyan-200/70 text-sm tracking-widest uppercase">
                        Your Score
                    </p>

                    <div className={`text-5xl font-extrabold ${getScoreColor(score)}`}>
                        {score}%
                    </div>

                    <p className="mt-1 text-cyan-300/80 text-sm">
                        {getScoreMessage(score)}
                    </p>
                </div>
            </div>

            {/* Stats — BELOW SCORE */}
            <div className="mt-6 rounded-2xl border border-cyan-400/25 bg-cyan-500/5 px-6 py-4">
                <div className="grid grid-cols-3 text-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <Target className="w-6 h-6 text-cyan-400" />
                        <span className="text-xl font-semibold text-cyan-300">
                            {totalQuestions}
                        </span>
                        <span className="text-xs tracking-widest uppercase text-cyan-200/60">
                            Total
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <span className="text-xl font-semibold text-emerald-300">
                            {correctAnswers}
                        </span>
                        <span className="text-xs tracking-widest uppercase text-emerald-200/60">
                            Correct
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <XCircle className="w-6 h-6 text-rose-400" />
                        <span className="text-xl font-semibold text-rose-300">
                            {incorrectAnswers}
                        </span>
                        <span className="text-xs tracking-widest uppercase text-rose-200/60">
                            Incorrect
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* QUESTIONS REVIEW */}
    <div className="mt-14 max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-cyan-300">
                Detailed Review
            </h3>
        </div>

        {detailedResults.map((result, index) => {
            const userAnswerIndex = result.options.findIndex(opt => opt === result.selectedAnswer);
            const correctAnswerIndex = result.correctAnswer.startsWith('O')
                ? parseInt(result.correctAnswer.substring(1)) - 1
                : result.options.findIndex(opt => opt === result.correctAnswer);

            const isCorrect = result.isCorrect;

            return (
                <div
                    key={index}
                    className="rounded-2xl border border-cyan-400/25 bg-cyan-500/5 px-6 py-5"
                >
                    {/* Question Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-cyan-200/60">
                                Question {index + 1}
                            </span>
                            <h4 className="mt-1 text-cyan-200 font-medium">
                                {result.question}
                            </h4>
                        </div>

                        {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                            <XCircle className="w-6 h-6 text-rose-400" />
                        )}
                    </div>

                    {/* Options */}
                    <div className="mt-4 space-y-2">
                        {result.options.map((option, optIndex) => {
                            const isCorrectOption = optIndex === correctAnswerIndex;
                            const isUserAnswer = optIndex === userAnswerIndex;
                            const isWrongAnswer = isUserAnswer && !isCorrect;

                            return (
                                <div
                                    key={optIndex}
                                    className={`rounded-lg px-4 py-2 border ${
                                        isCorrectOption
                                            ? 'border-emerald-400/40 bg-emerald-400/10'
                                            : isWrongAnswer
                                            ? 'border-rose-400/40 bg-rose-400/10'
                                            : 'border-cyan-400/20'
                                    }`}
                                >
                                    <span className="text-sm text-cyan-200">
                                        {option}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    {result.explanation && (
                        <div className="mt-4 border-t border-cyan-400/20 pt-4 text-sm text-cyan-200">
                            <span className="block text-xs uppercase tracking-widest text-cyan-200/60 mb-1">
                                Explanation
                            </span>
                            {result.explanation}
                        </div>
                    )}
                </div>
            );
        })}
    </div>

    {/* Action Button */}
        <div className="mt-16 flex justify-center">
            <Link to={`/documents/${quiz.document._id}`}>
                <button
                    className="group relative flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-cyan-500/5 px-8 py-4 backdrop-blur-xl
                            text-cyan-300 font-semibold tracking-wide transition-all duration-300
                            hover:bg-cyan-400/10 hover:border-cyan-300 hover:text-cyan-200
                            shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                >
                    <ArrowLeft
                        className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                        strokeWidth={2.5}
                    />

                    <span>
                        Return to Document
                    </span>

                    {/* Glow accent line */}
                    <div className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
            </Link>
        </div>


</div>

    )
}

export default QuizResultPage
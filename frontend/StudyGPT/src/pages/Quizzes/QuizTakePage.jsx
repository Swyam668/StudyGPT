import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from '../../components/common/PageHeader';
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";


const QuizTakePage = () => {

    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await quizService.getQuizById(quizId);
                setQuiz(response.data);
            } catch (error) {
                toast.error('Failed to fetch quiz.')
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);


    // adding to selected Answer as soon as an option is selected by user, then at the end, we just need to send selectedAnswers to the backend directly
    const handleOptionChange = (questionId, optionIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    const handleNextQuestion = () => {
        if(currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if(currentQuestionIndex > 0){
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        setSubmitting(true);
        try {
                const formattedAnswers = Object.keys(selectedAnswers).map(questionId => {
                const question = quiz.questions.find(q => q._id === questionId);
                const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
                const optionIndex = selectedAnswers[questionId];
                const selectedAnswer = question.options[optionIndex];
                return { questionIndex, selectedAnswer };
            });

            await quizService.submitQuiz(quizId, formattedAnswers);
            toast.success('Quiz submitted successfully!');
            navigate(`/quizzes/${quizId}/results`);
        } catch (error) {
            toast.error(error.message || 'Failed to submit quiz.')
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-950/30 backdrop-blur shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                <Spinner />
            </div>
        );
    }


    if (!quiz || quiz.questions.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center p-6">
                <div className="max-w-md rounded-2xl border border-cyan-400/30 bg-cyan-950/40 px-6 py-5 text-center backdrop-blur shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <p className="text-sm font-medium tracking-wide text-cyan-200">
                        Quiz not found or has no questions.
                    </p>
                    <p className="mt-2 text-xs text-cyan-400/70">
                        Try regenerating the quiz or selecting another document.
                    </p>
                </div>
            </div>
        );
    }


    const currentQuestion = quiz.questions[currentQuestionIndex]
    // searching for 'currentQuestion._id' in selectedAnswers, not inherited
    const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
    // using Object class to get keys of this map (selectedAnswers)
    const answeredCount = Object.keys(selectedAnswers).length;


    return (
        <div className="flex h-full w-full flex-col gap-6 p-4">
            <PageHeader title={quiz.title || 'Take Quiz'} />

            {/* Progress Bar */}
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-4 backdrop-blur shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium tracking-wide text-cyan-200">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </span>
                    <span className="text-cyan-400/80">
                        {answeredCount} answered
                    </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-cyan-900/50">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                        style={{
                            width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="relative rounded-2xl border border-cyan-400/30 bg-cyan-950/40 p-6 backdrop-blur shadow-[0_0_35px_rgba(34,211,238,0.2)]">
                <div className="mb-4 flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                    <span className="text-sm font-semibold tracking-wider text-cyan-300 uppercase">
                        Question {currentQuestionIndex + 1}
                    </span>
                </div>

                <h3 className="text-lg font-medium leading-relaxed tracking-wide text-cyan-100">
                    {currentQuestion.question}
                </h3>
                
                {/* Options */}
                <div className="mt-4 flex flex-col gap-3">
                    {currentQuestion.options.map((option, index) => {
                        // currentQuestion is state, so isSelected changes as soon as we click on  other option, and the options are styled accordingly
                        const isSelected = selectedAnswers[currentQuestion._id] === index;

                        return (
                            <label
                                key={index}
                                className={`
                                    relative flex cursor-pointer items-center gap-4
                                    rounded-2xl border px-5 py-4 transition-all duration-300
                                    ${
                                        isSelected
                                            ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.35)]'
                                            : 'border-cyan-400/20 bg-cyan-950/30 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion._id}`}
                                    value={index}
                                    checked={isSelected}
                                    onChange={() =>
                                        handleOptionChange(currentQuestion._id, index)
                                    }
                                    className="hidden"
                                />

                                {/* Custom Radio Button */}
                                <div
                                    className={`
                                        flex h-5 w-5 items-center justify-center rounded-full border transition-all
                                        ${
                                            isSelected
                                                ? 'border-cyan-300 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                                                : 'border-cyan-400/40 bg-transparent'
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <div className="h-2 w-2 rounded-full bg-cyan-900" />
                                    )}
                                </div>

                                {/* Option Text */}
                                <span
                                    className={`
                                        flex-1 text-sm leading-relaxed transition-colors
                                        ${
                                            isSelected
                                                ? 'font-medium text-cyan-100'
                                                : 'text-cyan-200/80'
                                        }
                                    `}
                                >
                                    {option}
                                </span>

                                {/* Selected Checkmark */}
                                {isSelected && (
                                    <CheckCircle2
                                        className="h-5 w-5 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
                                        strokeWidth={2.5}
                                    />
                                )}
                            </label>
                        );
                    })}
                </div>

            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
                {/* Previous */}
                <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0 || submitting}
                    variant="secondary"
                    className="
                        flex items-center gap-2
                        rounded-xl border border-cyan-400/30
                        bg-cyan-950/40 px-5 py-2.5
                        text-sm font-medium text-cyan-200
                        transition-all
                        hover:border-cyan-400/60 hover:bg-cyan-400/10
                        hover:shadow-[0_0_15px_rgba(34,211,238,0.35)]
                        disabled:cursor-not-allowed disabled:opacity-40
                    "
                >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                    Previous
                </Button>

                {/* Next / Submit */}
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button
                        onClick={handleSubmitQuiz}
                        disabled={submitting}
                        className="
                            relative overflow-hidden
                            rounded-xl border border-cyan-400/40
                            bg-cyan-500/20 px-6 py-2.5
                            font-semibold text-cyan-100
                            transition-all
                            hover:bg-cyan-400/30
                            hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {submitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                                    Submit Quiz
                                </>
                            )}
                        </span>

                        {/* Shine sweep */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent transition-transform duration-700 hover:translate-x-full" />
                    </button>
                ) : (
                    <Button
                        onClick={handleNextQuestion}
                        disabled={submitting}
                        className="
                            flex items-center gap-2
                            rounded-xl border border-cyan-400/40
                            bg-cyan-500/20 px-5 py-2.5
                            text-sm font-medium text-cyan-100
                            transition-all
                            hover:bg-cyan-400/30
                            hover:shadow-[0_0_18px_rgba(34,211,238,0.45)]
                            disabled:cursor-not-allowed disabled:opacity-40
                        "
                    >
                        Next
                        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                    </Button>
                )}
            </div>

            {/* Question Navigation Dots */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
                {quiz.questions.map((_, index) => {
                    const isAnsweredQuestion =
                        selectedAnswers.hasOwnProperty(quiz.questions[index]._id);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`
                                flex h-9 w-9 items-center justify-center
                                rounded-full border text-sm font-semibold
                                transition-all duration-300
                                ${
                                    isCurrent
                                        ? 'border-cyan-300 bg-cyan-400/30 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.6)] scale-110'
                                        : isAnsweredQuestion
                                        ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20'
                                        : 'border-cyan-400/20 bg-cyan-950/40 text-cyan-400/70 hover:border-cyan-400/50'
                                }
                            `}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

        </div>
    );

}

export default QuizTakePage
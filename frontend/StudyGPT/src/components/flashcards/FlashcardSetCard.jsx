import React from 'react';
import {useNavigate} from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react'
import moment from 'moment'

const FlashcardSetCard = ({flashcardSet}) => {
    
    const navigate = useNavigate();

    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
    };

    const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount) / totalCards * 100) : 0;
    
    return (
        <div
            className="
                group relative cursor-pointer
                rounded-2xl
                p-6
                bg-gradient-to-br from-cyan-950/80 via-slate-950/90 to-black
                border border-cyan-400/20
                shadow-[0_0_35px_rgba(34,211,238,0.15)]
                transition-all duration-300
                hover:border-cyan-400/50
                hover:shadow-[0_0_60px_rgba(34,211,238,0.35)]
                hover:-translate-y-1
            "
            onClick={handleStudyNow}
        >
            {/* Glow layer */}
            <div className="
                pointer-events-none
                absolute inset-0
                rounded-2xl
                bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_60%)]
                opacity-0 group-hover:opacity-100
                transition-opacity
            " />

            {/* Header */}
            <div className="flex items-start gap-4 relative z-10">
                <div className="
                    flex items-center justify-center
                    w-12 h-12
                    rounded-xl
                    bg-cyan-400/10
                    border border-cyan-400/30
                    shadow-inner shadow-cyan-400/20
                ">
                    <BookOpen className="w-6 h-6 text-cyan-300" strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0">
                    <h3
                        className="
                            text-lg font-semibold
                            text-cyan-100
                            truncate
                            group-hover:text-cyan-200
                            transition
                        "
                        title={flashcardSet?.documentId?.title}
                    >
                        {flashcardSet?.documentId?.title}
                    </h3>
                    <p className="text-sm text-cyan-400/70 mt-1">
                        Created {moment(flashcardSet.createdAt).fromNow()}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="
                mt-5
                flex items-center justify-between
                text-sm
                text-cyan-200/80
                relative z-10
            ">
                <div className="
                    px-3 py-1
                    rounded-full
                    bg-cyan-400/10
                    border border-cyan-400/30
                ">
                    {totalCards} {totalCards == 1 ? 'Card' : 'Cards'}
                </div>

                {reviewedCount > 0 && (
                    <div className="
                        flex items-center gap-1
                        px-3 py-1
                        rounded-full
                        bg-emerald-400/10
                        border border-emerald-400/30
                        text-emerald-300
                    ">
                        <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                        <span>{progressPercentage}%</span>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {totalCards > 0 && (
                <div className="mt-5 relative z-10">
                    <div className="flex justify-between text-xs text-cyan-300/70 mb-2">
                        <span>Progress</span>
                        <span>{reviewedCount}/{totalCards} reviewed</span>
                    </div>

                    <div className="
                        h-2
                        rounded-full
                        bg-cyan-950
                        border border-cyan-400/20
                        overflow-hidden
                    ">
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-gradient-to-r from-cyan-400 to-emerald-400
                                shadow-[0_0_15px_rgba(34,211,238,0.6)]
                                transition-all duration-500
                            "
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Study Button */}
            <div className="mt-6 relative z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleStudyNow();
                    }}
                    className="
                        relative w-full
                        rounded-xl
                        px-4 py-3
                        bg-cyan-400/10
                        border border-cyan-400/30
                        text-cyan-200 font-medium
                        transition-all duration-300
                        hover:bg-cyan-400/20
                        hover:border-cyan-300
                        hover:shadow-[0_0_25px_rgba(34,211,238,0.45)]
                        active:scale-95
                    "
                >
                    <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-cyan-300" strokeWidth={2.5} />
                        Study Now
                    </span>

                    <div className="
                        pointer-events-none
                        absolute inset-0
                        rounded-xl
                        bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_65%)]
                        opacity-0 hover:opacity-100
                        transition-opacity
                    " />
                </button>
            </div>
        </div>

    )
}

export default FlashcardSetCard
import { Star, RotateCcw } from "lucide-react";
import { useState } from "react";

const Flashcard = ({ flashcard, onToggleStar }) => {
    
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div
            className="w-full max-w-xl mx-auto"
            style={{ perspective: "1000px" }}
        >
            <div
                className="
                    relative
                    h-64
                    cursor-pointer
                    transition-transform
                    duration-700
                    ease-in-out
                "
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                onClick={handleFlip}
            >
                {/* Front of the card */}
                <div
                    className="
                        absolute inset-0
                        rounded-2xl
                        border border-cyan-400/40
                        bg-gradient-to-br from-cyan-500/10 to-slate-900
                        backdrop-blur-xl
                        shadow-[0_0_25px_rgba(34,211,238,0.25)]
                        flex flex-col
                        justify-between
                        p-6
                    "
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >

                    {/* Star Button */}
                    <div className="flex items-center justify-between">
                        {/* Difficulty Badge */}
                        <div
                            className="
                                px-3 py-1
                                rounded-full
                                text-xs font-semibold
                                tracking-wider uppercase
                                text-cyan-200
                                bg-cyan-400/10
                                border border-cyan-400/30
                                shadow-[0_0_10px_rgba(34,211,238,0.35)]
                                backdrop-blur-md
                            "
                        >
                            {flashcard?.difficulty}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleStar(flashcard._id);
                            }}
                            className={`
                                p-2 rounded-full
                                transition-all duration-300
                                ${
                                    flashcard.isStarred
                                        ? "text-cyan-300 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                                        : "text-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-400/10"
                                }
                            `}
                        >
                            <Star
                                className="w-5 h-5"
                                strokeWidth={2}
                                fill={flashcard.isStarred ? "currentColor" : "none"}
                            />
                        </button>
                    </div>


                    {/* Question Face */}
                    <div className="flex-1 flex items-center justify-center text-center px-2">
                        <p className="text-cyan-100 text-lg font-medium leading-relaxed">
                            {flashcard.question}
                        </p>
                    </div>

                    {/* Flip Indicator */}
                    <div className="flex items-center justify-center gap-2 text-cyan-400/70 text-sm">
                        <RotateCcw className="w-4 h-4" strokeWidth={2} />
                        <span className="tracking-wide">
                            Click to reveal answer
                        </span>
                    </div>
                </div>

                {/* Back of the card -- Answer */}
                <div
                    className="
                        absolute inset-0
                        rounded-2xl
                        border border-cyan-400/30
                        bg-gradient-to-br from-slate-900 to-cyan-500/10
                        backdrop-blur-xl
                        shadow-[0_0_25px_rgba(34,211,238,0.2)]
                        flex flex-col
                        justify-between
                        p-6
                    "
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {/* Star Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={(e) => {
                                // to not flip the card
                                e.stopPropagation();
                                onToggleStar(flashcard._id);
                            }}
                            className={`
                                p-2 rounded-full
                                transition-all duration-300
                                ${
                                    flashcard.isStarred
                                        ? "text-cyan-300 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                                        : "text-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-400/10"
                                }
                            `}
                        >
                            <Star
                                className="w-5 h-5"
                                strokeWidth={2}
                                fill={flashcard.isStarred ? "currentColor" : "none"}
                            />
                        </button>
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1 flex items-center justify-center text-center px-3">
                        <p className="text-cyan-100 text-base leading-relaxed font-normal">
                            {flashcard.answer}
                        </p>
                    </div>

                    {/* Flip Indicator */}
                    <div className="flex items-center justify-center gap-2 text-cyan-400/60 text-sm">
                        <RotateCcw className="w-4 h-4" strokeWidth={2} />
                        <span className="tracking-wide">
                            Click to see the question
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;

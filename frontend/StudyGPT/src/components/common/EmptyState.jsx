import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
    return (
        <div className="flex-1 min-h-0 w-full h-full flex items-center justify-center">
            {/* Card */}
            <div
                className="
                    flex flex-col items-center justify-center
                    text-center
                    px-6 py-12
                    rounded-2xl
                    border border-cyan-400/20
                    bg-cyan-950/30
                    backdrop-blur
                    w-full
                    max-w-md
                "
            >
                {/* Icon */}
                <div
                    className="
                        mb-4
                        flex items-center justify-center
                        w-14 h-14
                        rounded-xl
                        bg-cyan-400/10
                        border border-cyan-400/30
                        shadow-[0_0_14px_rgba(34,211,238,0.35)]
                    "
                >
                    <FileText
                        className="w-7 h-7 text-cyan-300"
                        strokeWidth={2}
                    />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-cyan-300 tracking-wide">
                    {title}
                </h3>

                {/* Description */}
                <p className="mt-1 text-sm text-cyan-400/70 max-w-sm">
                    {description}
                </p>

                {/* Action Button */}
                {buttonText && onActionClick && (
                    <button
                        onClick={onActionClick}
                        className="
                            group
                            mt-6
                            relative
                            inline-flex items-center gap-2
                            rounded-xl
                            border border-cyan-400/30
                            bg-cyan-500/20
                            px-5 py-2.5
                            text-sm font-medium
                            text-cyan-300
                            hover:bg-cyan-400/30
                            hover:text-cyan-200
                            shadow-[0_0_14px_rgba(34,211,238,0.35)]
                            transition-all
                        "
                    >
                        <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            {buttonText}
                        </span>

                        {/* Hover glow only */}
                        <div
                            className="
                                absolute inset-0
                                rounded-xl
                                opacity-0
                                group-hover:opacity-100
                                transition
                                blur-md
                                bg-cyan-400/20
                                -z-10
                            "
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;

import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";

import quizService from '../../services/quizService';
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Button from '../common/Button';
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({documentId}) => {

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [numQuestions, setNumQuestions] = useState(5);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleintg, setDeleting] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const data = await quizService.getQuizzesForDocument(documentId);
            setQuizzes(data.data);
        } catch (error) {
            toast.error('Failed to fetch quizzes.');
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(documentId) {
            fetchQuizzes();
        }
    }, [documentId]);

    const handleGenerateQuiz = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await aiService.generateQuiz(documentId, { numQuestions });
            toast.success('Quiz generated successfully!');
            setIsGenerateModalOpen(false);
            fetchQuizzes();
        } catch (error) {
            toast.error(error.message || 'Failed to generate Quiz.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {

    };

    const renderQuizContent = () => {
        if(loading) {
            return <Spinner />
        }

        if(quizzes.length === 0) {
            return (
                <EmptyState
                 title="No Quizzes Yet"
                 description="Generate a quiz from your documents."
                />
            );
        }


        return (
            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >
                {quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz._id}
                        quiz={quiz}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        );

    };


    return (
    <div className="w-full h-full p-4 bg-[#0b0f16] rounded-2xl shadow-lg shadow-cyan-500/20 overflow-auto">
        <div className="flex h-full flex-col space-y-6">
            {/* Header / Action Bar */}
            <div
                className="
                    flex items-center justify-between
                    rounded-2xl
                    border border-cyan-400/20
                    bg-cyan-950/30
                    px-6 py-4
                    backdrop-blur
                    shadow-[0_0_20px_rgba(34,211,238,0.15)]
                "
            >
                <div>
                    <h3 className="text-lg font-semibold tracking-wide text-cyan-300">
                        Quiz Manager
                    </h3>
                    <p className="text-sm text-cyan-400/70">
                        Generate and manage quizzes for this document
                    </p>
                </div>

                <Button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="
                        flex items-center gap-2
                        rounded-xl
                        border border-cyan-400/40
                        bg-cyan-500/10
                        px-4 py-2
                        text-sm font-medium text-cyan-300
                        transition-all
                        hover:bg-cyan-400/20
                        hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]
                        active:scale-[0.98]
                    "
                >
                    <Plus size={16} />
                    Generate Quiz
                </Button>
            </div>

            {/* Quiz Content */}
            <div
                className="
                    flex-1
                    min-h-0
                    rounded-2xl
                    border border-cyan-400/20
                    bg-cyan-950/30
                    p-4
                    backdrop-blur
                "
            >
                {renderQuizContent()}
            </div>
        </div>
    </div>
);

}

export default QuizManager
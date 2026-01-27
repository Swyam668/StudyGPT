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
    const [deleting, setDeleting] = useState(false);
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

    const handleConfirmDelete = async () => {
        if(!selectedQuiz) return;
        setDeleting(true);
        try {
            await quizService.deleteQuiz(selectedQuiz._id);
            toast.success(`'${selectedQuiz.title|| 'Quiz'}' deleted.`);
            setIsDeleteModalOpen(false);
            setSelectedQuiz(null);
            setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
        } catch (error) {
            toast.error(error.message || 'Failed to delete quiz.');
        } finally {
            setDeleting(false);
        }
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
                <Modal
                    isOpen={isGenerateModalOpen}
                    onClose={() => setIsGenerateModalOpen(false)}
                    title="Generate New Quiz"
                    >
                    <form
                    onSubmit={handleGenerateQuiz}
                    className="space-y-6"
                    >
                    {/* Input Field */}
                    <div className="space-y-2">
                    <label className="text-sm font-medium tracking-wide text-cyan-200">
                    Number of Questions
                    </label>
                    <input
                    type="text"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    required
                    className="w-full rounded-xl border border-cyan-400/30 bg-cyan-500/5 px-4 py-2.5 text-cyan-100 placeholder-cyan-400/50 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                    />
                    </div>


                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                    <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsGenerateModalOpen(false)}
                    disabled={generating}
                    className="rounded-xl border border-cyan-400/30 bg-transparent px-5 py-2 text-cyan-200 transition hover:bg-cyan-400/10"
                    >
                    Cancel
                    </Button>


                    <Button
                    type="submit"
                    disabled={generating}
                    className="relative overflow-hidden rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-6 py-2 font-medium text-cyan-100 transition hover:bg-cyan-400/30"
                    >
                    <span className="relative z-10">
                    {generating ? 'Generating...' : 'Generate'}
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent transition-transform duration-500 hover:translate-x-full" />
                    </Button>
                    </div>
                    </form>
                    </Modal>
            
        {/* Delete Confirmation */}
        <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Confirm Delete Quiz"
            >
            <div className="space-y-6">
            <p className="text-sm leading-relaxed text-cyan-200">
            Are you sure you want to delete the quiz:{" "}
            <span className="font-semibold text-cyan-100">
            {selectedQuiz?.title || 'this quiz'}
            </span>
            ?
            <br />
            <span className="mt-2 inline-block text-xs text-cyan-400/70">
            This action cannot be undone.
            </span>
            </p>


            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
            <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleting}
            className="rounded-xl border border-cyan-400/30 bg-transparent px-5 py-2 text-cyan-200 transition hover:bg-cyan-400/10"
            >
            Cancel
            </Button>


            <Button
            onClick={handleConfirmDelete}
            disabled={deleting}
            className="relative overflow-hidden rounded-xl border border-red-400/40 bg-red-500/10 px-6 py-2 font-medium text-red-300 transition hover:bg-red-500/20"
            >
            <span className="relative z-10">
            {deleting ? 'Deleting...' : 'Delete'}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-400/30 to-transparent transition-transform duration-500 hover:translate-x-full" />
            </Button>
            </div>
            </div>
            </Modal>
    </div>
);

}

export default QuizManager
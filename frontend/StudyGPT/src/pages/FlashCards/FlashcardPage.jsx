import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    ChevronLeft,
    ChevronRight,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

import flashcardService from '../../services/flashcardService';
import aiService from '../../services/aiService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Flashcard from '../../components/flashcards/Flashcard';

const FlashCardPage = () => {

    const { id: documentId } = useParams();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchFlashcards = async () => {
        setLoading(true);
        try {
            const response = await flashcardService.getFlashcardsForDocument(documentId);
            setFlashcardSets(response.data[0]);
            setFlashcards(response.data[0]?.cards || []);
        } catch (error) {
            toast.error("Failed to fetch flashcards.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, [documentId]);

    const handleGenerateFlashcards = async () => {
        setGenerating(true);
        try {
            await aiService.generateFlashcards(documentId);
            toast.success('Flashcards generated successfully!');
            fetchFlashcards();
        } catch (error) {
            toast.error(error.message || 'Failed to generate flashcards.');
        } finally {
            setGenerating(false);
        }
    };

    const handleNextCard = () => {
        handleReview(currentCardIndex);
        setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrevCard = () => {
        handleReview(currentCardIndex);
        setCurrentCardIndex(
            (prev) => (prev - 1 + flashcards.length) % flashcards.length
        );
    };

    const handleReview = async (index) => {
        const currentCard = flashcards[currentCardIndex];
        if (!currentCard) return;

        try {
            await flashcardService.reviewFlashcard(currentCard._id, index);
            toast.success('Flashcard reviewed successfully!')
        } catch {
            toast.error("Failed to review flashcard.");
        }
    };

    const handleToggleStar = async (cardId) => {
        try {
            await flashcardService.toggleStar(cardId);
            setFlashcards((prevFlashcards) =>
                prevFlashcards.map((card) =>
                    card._id == cardId
                        ? { ...card, isStarred: !card.isStarred }
                        : card
                )
            );
            toast.success('Flashcard Starred status updated successfully!')
        } catch {
            toast.error('Failed to update flashcard star status');
        }
    };

    const handleDeleteFlashcard = async () => {
        setDeleting(true);
        try {
            await flashcardService.deleteFlashcardSet(flashcardSets._id);
            toast.success("Flashcard set deleted successfully!");
            setIsDeleteModalOpen(false);
            fetchFlashcards();
        } catch (error) {
            toast.error(error.message || 'Failed to delete flashcard set.');
        } finally {
            setDeleting(false);
        }
    };

    const renderFlashcardContent = () => {
        if (loading) return <Spinner />;

        if (flashcards.length === 0) {
            return (
                <EmptyState
                    title="No Flashcards yet"
                    description="Generate flashcards from your document and start learning"
                />
            );
        }

        const currentCard = flashcards[currentCardIndex];

        return (
            <div className="mt-10 flex flex-col items-center gap-8">
                <div className="w-full max-w-3xl">
                    <Flashcard
                        flashcard={currentCard}
                        onToggleStar={handleToggleStar}
                    />
                </div>

                <div className="flex items-center gap-6 bg-cyan-500/10 backdrop-blur-md px-6 py-3 rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                    <Button
                        onClick={handlePrevCard}
                        variant="secondary"
                        disabled={flashcards.length <= 1}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft size={16} /> Previous
                    </Button>

                    <span className="text-cyan-300 font-mono text-sm">
                        {currentCardIndex + 1} / {flashcards.length}
                    </span>

                    <Button
                        onClick={handleNextCard}
                        variant="secondary"
                        disabled={flashcards.length <= 1}
                        className="flex items-center gap-2"
                    >
                        Next <ChevronRight size={16} />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#031a2b] text-white px-6 py-8">
            {/* Back */}
            <Link
                to={`/documents/${documentId}`}
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition mb-6"
            >
                <ArrowLeft size={16} />
                Back to Document
            </Link>

            <PageHeader title="Flashcards">
                <div className="flex gap-3">
                    {!loading &&
                        (flashcards.length > 0 ? (
                            <Button
                                onClick={() => setIsDeleteModalOpen(true)}
                                disabled={deleting}
                                className="
                                    flex items-center gap-2
                                    rounded-full
                                    px-5 py-2.5
                                    bg-red-500/10
                                    border border-red-400/40
                                    text-red-400
                                    backdrop-blur-md
                                    hover:bg-red-500/20
                                    hover:shadow-[0_0_20px_rgba(248,113,113,0.35)]
                                    transition-all duration-300
                                    disabled:opacity-50
                                "
                            >
                                <Trash2 size={16} />
                                Delete Set
                            </Button>

                        ) : (
                            <Button
                                onClick={handleGenerateFlashcards}
                                disabled={generating}
                                className="bg-cyan-500/20 border border-cyan-400/40 hover:bg-cyan-500/30"
                            >
                                {generating ? <Spinner /> : <><Plus size={16} /> Generate</>}
                            </Button>
                        ))}
                </div>
            </PageHeader>

            {renderFlashcardContent()}

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm deletion"
            >
                <div className="space-y-6">
                    <p className="text-sm text-gray-300">
                        Are you sure you want to delete all flashcards for this document?
                    </p>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteFlashcard}
                            disabled={deleting}
                            className="bg-red-500/20 border border-red-400/40 text-red-400"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FlashCardPage;

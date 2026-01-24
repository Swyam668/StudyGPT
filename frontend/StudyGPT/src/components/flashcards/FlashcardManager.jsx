import React, { useState, useEffect } from "react";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Trash2,
    ArrowLeft,
    Sparkles,
    Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from '../../services/flashcardService';
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

const FlashcardManager = ({documentId}) => {

    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [setToDelete, setSetToDelete] = useState(null);

    const fetchFlashcardSets = async () => {
        setLoading(true);
        try {
            const response = await flashcardService.getFlashcardsForDocument(
                documentId
            );
            setFlashcardSets(response.data);
        } catch (error) {
            toast.error("Failed to fetch flashcard sets");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(documentId) {
            fetchFlashcardSets();
        }
    }, [documentId]);

    const handleGenerateFlashcards = async () => {
        setGenerating(true);
        try {
            await aiService.generateFlashcards(documentId);
            toast.success("Flashcards generated successfully!");
            fetchFlashcardSets();
        } catch (error) {
            toast.error(error.message || "Failed to generate flashcards");
        } finally {
            setGenerating(false);
        }
    };

    const handleNextCard = () => {
        if(selectedSet) {
            handleReview(currentCardIndex);
            setCurrentCardIndex(
                // prevIndex comes from React itself
                // this is changed, rather than currentCardIndex, becuase that is unsafe
                // prevIndex === the latest value of currentCardIndex at the moment React applies the update
                (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
            );
        }
    };

    const handlePrevCard = () => {
        if(selectedSet) {
            handleReview(currentCardIndex);
            setCurrentCardIndex(
                (prevIndex) => 
                // when prevIndex == -1, then result is -1, not n-1
                (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
            );
        }
    };

    const handleReview = async (index) => {
        const currentCard = selectedSet?.cards[currentCardIndex];
        if(!currentCard) return;

        try {
            await flashcardService.reviewFlashcard(currentCard._id, index);
            toast.success("Flashcard reviewed!")
        } catch (error) {
            toast.error("Failed to review flashcard.");
        }
    };

    // for faster loading, directly updating the frontend, no need to re-load -- because typically, reviewing a card should not reload a page completely, so we prevent it by updating the state and not calling 'fetchFlashcardSet()' function, unlike when we delete a flashcard set
    const handleToggleStar = async (cardId) => {
        try {
            await flashcardService.toggleStar(cardId);
            const updatedSets = flashcardSets.map((set) => {
                if(set._id === selectedSet._id){
                    const updatedCards = set.cards.map((card) => 
                     card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
                );
                return { ...set, cards: updatedCards };
                }
                return set;
            });
            setFlashcardSets(updatedSets);
            setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
            toast.success("Flashcard starred!");
        } catch (error) {
            toast.error("Failed to make the flashcard starred.")
        }
    };

    const handleDeleteRequest = (e, set) => {
        e.stopPropagation();
        setSetToDelete(set);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if(!setToDelete) return;
        setDeleting(true);
        try {
            await flashcardService.deleteFlashcardSet(setToDelete._id);
            toast.success("Flashcard set deleted successfully!");
            setIsDeleteModalOpen(false);
            setSetToDelete(null);
            fetchFlashcardSets();
        } catch (error) {
            toast.error(error.message || "Failed to delete flashcard set.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSelectSet = (set) => {
        setSelectedSet(set);
        setCurrentCardIndex(0);
    };

    const renderFlashcardViewer = () => {
        const currentCard = selectedSet.cards[currentCardIndex];

        return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => setSelectedSet(null)}
                className="flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
                <ArrowLeft
                    className="h-4 w-4"
                    strokeWidth={2}
                />
                Back to Sets
            </button>

            {/* Flashcard Display */}
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-6 backdrop-blur">
                <div className="w-full max-w-xl">
                    <Flashcard
                        flashcard={currentCard}
                        onToggleStar={handleToggleStar}
                    />
                </div>

                {/* Navigation Controls */}
                <div className="flex w-full max-w-xl items-center justify-between gap-4">
                    <button
                        onClick={handlePrevCard}
                        disabled={selectedSet.cards.length <= 1}
                        className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft
                            className="h-4 w-4"
                            strokeWidth={2.5}
                        />
                        Previous
                    </button>

                    <div className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5">
                        <span className="text-xs font-semibold text-cyan-300">
                            {currentCardIndex + 1}{" "}
                            <span className="text-cyan-400/60">/</span>{" "}
                            {selectedSet.cards.length}
                        </span>
                    </div>

                    <button
                        onClick={handleNextCard}
                        disabled={selectedSet.cards.length <= 1}
                        className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight
                            className="h-4 w-4"
                            strokeWidth={2}
                        />
                    </button>
                </div>
            </div>
        </div>
    );

    };

    const renderSetList = () => {
        if(loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            );
        }



        // we used useEffect to get the flashcards from database as soon as the url loads and selected the set, if still not selected, (it means no flashcards generated yet), we call this function, where i am telling the user that no flashcards generated yet.
        if(flashcardSets.length === 0){
            return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#0b0f16] text-cyan-400 p-4 rounded-xl">
                <div className="p-3 bg-cyan-900/20 rounded-full shadow-md shadow-cyan-500/20">
                    <Brain className="w-10 h-10 text-cyan-400 animate-pulse" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-semibold text-cyan-300">
                    No Flashcards Yet
                </h3>

                <p className="text-center text-cyan-200 text-sm max-w-xs">
                    Generate flashcards from your document to start learning and reinforce your knowledge.
                </p>

                <button
                    onClick={handleGenerateFlashcards}
                    disabled={generating}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-100 text-sm font-medium rounded-lg hover:bg-cyan-500/40 transition-all duration-300 shadow-md shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {generating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-t-cyan-300 border-cyan-500 rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" strokeWidth={2} />
                            Generate Flashcards
                        </>
                )}
                </button>
            </div>
        );
        }

        return (
    <div className="space-y-6">
        {/* Header with Generate buttons */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-950/30 px-6 py-4 backdrop-blur">
            <div>
                <h3 className="text-lg font-semibold tracking-wide text-cyan-300">
                    Your Flashcard Sets
                </h3>
                <p className="text-sm text-cyan-400/70">
                    {flashcardSets.length}{" "}
                    {flashcardSets.length === 1 ? "set" : "sets"} available
                </p>
            </div>

            <button
                onClick={handleGenerateFlashcards}
                disabled={generating}
                className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {generating ? (
                    <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        Generate New Set
                    </>
                )}
            </button>
        </div>

        {/* Flashcard Sets Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flashcardSets.map((set) => {
                return (
                    <div
                        key={set._id}
                        onClick={() => handleSelectSet(set)}
                        className="group relative cursor-pointer rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-5 transition-all hover:border-cyan-400/60 hover:bg-cyan-900/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
                    >
                        {/* Delete button */}
                        <button
                            onClick={(e) => handleDeleteRequest(e, set)}
                            className="absolute right-3 top-3 rounded-lg p-2 text-cyan-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </button>

                        {/* Set Content */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300">
                                <Brain className="h-6 w-6" strokeWidth={2} />
                            </div>

                            <div className="flex-1">
                                <h4 className="text-base font-semibold text-cyan-200">
                                    Flashcard Set
                                </h4>
                                <p className="mt-1 text-xs text-cyan-400/70">
                                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                                </p>

                                <div className="mt-3 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1">
                                    <span className="text-xs font-medium text-cyan-300">
                                        {set.cards.length}{" "}
                                        {set.cards.length === 1 ? "card" : "cards"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

    };
    
    
    return (
        <>
            <div className="w-full h-full p-4 bg-[#0b0f16] rounded-2xl shadow-lg shadow-cyan-500/20 overflow-auto">
                {selectedSet ? renderFlashcardViewer() : renderSetList()}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    title="Delete Flashcard Set"
>
    <div className="space-y-6">
        <p className="text-sm leading-relaxed text-cyan-300/80">
            Are you sure you want to delete this flashcard set?
            <span className="block text-red-400/80">
                This action cannot be undone.
            </span>
        </p>

        <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition-all hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Cancel
            </button>

            <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 hover:shadow-[0_0_18px_rgba(248,113,113,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {deleting ? (
                    <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        Deleting...
                    </span>
                ) : (
                    "Delete Set"
                )}
            </button>
        </div>
    </div>
</Modal>


        </>

    )
}

export default FlashcardManager
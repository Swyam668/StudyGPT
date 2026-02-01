import React, { useState, useEffect } from "react";
import flashcardService from '../../services/flashcardService';
import PageHeader from '../../components/common/PageHeader' ;
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import toast from 'react-hot-toast';


const FlashcardsListPage = () => {
    const [flashcardSets, setFlashCardSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                const response = await flashcardService.getAllFlashcardSets();

                console.log("fetchFlashcardSets___", response.data);

                setFlashCardSets(response.data);
            } catch (error) {
                toast.error('Failed to fetch flashcard sets.')
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchFlashcardSets();
    }, [])

    const renderContent = () => {
        if(loading) {
            return <Spinner />
        }

        if(flashcardSets.length === 0){
            return (
                <EmptyState
                 title = "No Flashcard Sets Found"
                 description="You have not generated any flashcards yet!"
                />
            );
        }


        return (
            <div className="
                relative
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
                p-6
                bg-gradient-to-br from-cyan-950 via-slate-950 to-black
                rounded-2xl
                border border-cyan-400/20
                shadow-[0_0_40px_rgba(34,211,238,0.15)]
            ">
                {/* Glow overlay */}
                <div className="
                    pointer-events-none
                    absolute inset-0
                    rounded-2xl
                    bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_60%)]
                " />

                {flashcardSets.map((set) => (
                    <FlashcardSetCard key={set._id} flashcardSet={set} />
                ))}
            </div>
        );
    };

    return (
        <div>
            <PageHeader title="All Flashcard Sets" />
            {renderContent()}
        </div>
    )
}

export default FlashcardsListPage
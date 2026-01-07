import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';


// GET /api/progress/dashboard
export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashcardSets = await Flashcard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        // $ne -- not equal to
        const completedQuizzes    = await Quiz.countDocuments({ userId, completedAt: { $ne: null} });

        // FLASHCARD Stats
        // return an array (always, even if empty)
        const flashcardSets = await Flashcard.find({ userId });
        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(c => c.isStarred).length;
        });

        // QUIZ STATS
        const quizzes = await Quiz.find({ userId, completedAt: { $ne: null }});
        // IMPORTANT --- reduce method syntax
        const averageScore = quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) : 0;

        // recently used entities (just like history)
        const recentDocuments = await Document.find({ userId })
            .sort({ lastAccessed: -1 })
            .limit(5)
            .select('title fileName lastAccessed status');

        const recentQuizzes = await Quiz.find({ userId })
            .sort({ creatredAt: -1 })
            .limit(5)
            .populate('documentId', 'title')
            .select('title score totalQuestions completedAt');
        
        // IMPORTANT --- Improve this, for now just raw data for ease
        const studyStreak = Math.floor(Math.random() * 7) + 1;

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        });

    } catch (error) {
        next(error);
    }
}
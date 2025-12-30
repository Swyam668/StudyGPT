import Flashcard from '../models/Flashcard.js';

// get all flashcards of a document
// GET /api/flashcards/:documentId
// private route
export const getFlashcards = async (req, res, next) => {
    try{
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
         .populate('documentId', 'title fileName')
         .sort({ createdAt: -1 });
    
        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards
        });
    } catch(error){
        next(error);
    }
};

// get all flashcard sets for a user
// GET /api/flashcards/
// private route
export const getAllFlashcardSets = async (req, res, next) => {
    try{
        const flashcardSets = await Flashcard.find({ userId: req.user._id })
         .populate('documentId', 'title')
         .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets
        });
    } catch(error){
        next(error);
    }
};

// mark flashcard as reviewed
// POST /api/flashcards/:cardId/review
// private route
export const reviewFlashcard = async (req, res, next) => {
    try{
        // finding parent flashcard set first
        const flashcardSet = await Flashcard.findOne({
            // not _id as this is id of sub-documents, not the doument 'Flashcard' itself
            // card id is globally unique (not unique only within the document (flashcard))
            'cards._id': req.params.cardId,
            userId: req.user._id
        });

        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                error: 'Flashcard set or card not found',
                statusCode: 404
            });
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if(cardIndex === -1){
            return res.status(404).json({
                success: false,
                error: 'Card not found in the set',
                statusCode: 404
            });
        }
        
        // update review info
        // lastReviewed is of type Date object
        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.cards[cardIndex].reviewCount += 1;

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcard reviewed successfully'
        }); 
    }   catch(error){
        next(error);
    }
};

// toggle favorite on flashcard
// PUT /api/flashcard/:cardId/star
// private
export const toggleStarFlashcard = async (req, res, next) => {
    try{
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        });

        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                error: 'Flash card or card set not found',
                statusCode: 404
            });
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if(cardIndex != -1){
            return res.status(404).json({
                success: false,
                error: 'Card not found in set',
                statusCode: 404
            });
        }

        // toggle star (! -- toggling action)
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.card[cardIndex].isStarred;

        await flashcardSet.save();

        return res.status(200).json({
            success: true,
            data: flashcardSet,
            message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'}`
        });
    } catch(error){
        next(error);
    }
};

// delete flashcard set
// DELET /api/flashcards/:id
// private
export const deleteFlashcardSet = async (req, res, next) => {
    try{
        const flashcardSet = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                error: 'Flashcard set not found',
                statusCode: 404
            });
        }

        await flashcardSet.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Flashcard set deleted successfully'
        });
    } catch(error){
        next(error);
    }
};
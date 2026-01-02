import Document from '../models/Document.js';
import FlashCard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';
import Flashcard from '../models/Flashcard.js';

// Generate flashcards from document
// POST /api/ai/generate-flashcards
// private
export const generateFlashcards = async (req, res, next) => {
    try {
        // try lowering down the count (from 10) if you get Gemini API Overload error
        const { documentId, count = 10 } = req.body;

        if(!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide Document Id',
                statusCode: 400
            });
        }

        // finding processed (ready) document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        
        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count) // count comes as string in req
        );

        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            // map returns an array
            // new syntax here, direct ({...}) is equivalent to (return {...})
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false
            }))
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcards generated successfully'
        });
    } catch(error) {
        next(error);
    }
};

// generate quiz from document
// POST /api/ai/generate-quiz
// private
export const generateQuiz = async (req, res, next) => {

};

// Generate document summary
// POST /api/ai/generate-summary
// private
export const generateSummary = async (req, res, next) => {

};

// chat with document
// POST /api/ai/chat
// private
export const chat = async(req, res, next) => {

};

// explain concept from document
// POST /api/ai/explain-concept
// private
export const explainConcept = async (req, res, next) => {

};

// Get chat history for a doc
// GET /api/ai/chat-history/:documentId
// private
export const getChatHistory = async (req, res, next) => {

};
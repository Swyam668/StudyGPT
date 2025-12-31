import Document from '../models/Document.js';
import FlashCard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

// Generate flashcards from document
// POST /api/ai/generate-flashcards
// private
export const generateFlashcards = async (req, res, next) => {
    try {

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
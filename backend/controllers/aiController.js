import Document from '../models/Document.js';
import FlashCard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { generateEmbedding } from '../utils/embeddingService.js';
import { retrieveRelevantChunks } from '../utils/vectorSearch.js';
import Flashcard from '../models/Flashcard.js';
import { rerankChunks } from '../utils/reranker.js';

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
    try {
        const { documentId, numQuestions = 5, title } = req.body;

        if(!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a documentId',
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        // save to database
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully'
        });
    } catch(error) {
        next(error);
    }
};

// Generate document summary
// POST /api/ai/generate-summary
// private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId }= req.body;

        if(!documentId){
            return res.status(400).json({
                success: false,
                error: 'Please provide a document Id',
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document){
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        // now use geminiAPI to generate quiz
        const summary = await geminiService.generateSummary(document.extractedText);

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary // destructuring
            },
            message: 'Summary generated succcessfully'
        });

    } catch(error) {
        next(error);
    }
};

// chat with document
// POST /api/ai/chat
// private
export const chat = async(req, res, next) => {
    try {
        const { documentId, question } = req.body;

        if(!documentId){
            return res.status(400).json({
                success: false,
                error: 'Please provide a document Id and question',
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        
        if(!document){
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        // const queryEmbedding =
        //     await generateEmbedding(
        //         question
        //     );

        // const relevantChunks =
        //     await retrieveRelevantChunks(
        //         document._id,
        //         queryEmbedding,
        //         3
        //     );

        const queryEmbedding =
            await generateEmbedding(
                question
            );

        // testing RAG retrieved chunks by vector search
        // using console logs
        
        // console.log(
        //     "Query embedding length:",
        //     queryEmbedding.length
        // );

        const candidateChunks =
            await retrieveRelevantChunks(
                document._id,
                queryEmbedding,
                10
            );

        const ranking =
        await rerankChunks(
            question,
            candidateChunks
        );


        const relevantChunks =
            ranking
                .slice(0, 3)
                .map(
                    index =>
                        candidateChunks[index]
                );

            

        const chunkIndices = relevantChunks.map(c => c.chunkIndex);
        
        
        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        });

        if(!chatHistory){
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            });
        }

        // Why Markov Chains are useful -- matches
        // Why are they are useful -- won't match
        const answer = await geminiService.chatWithContext(question, relevantChunks);

        chatHistory.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date(),
                relevantChunks: []
            },
            {
                role: 'assistant',
                content: answer,
                timestamp: new Date(),
                relevantChunks: chunkIndices
            }
        );

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks: chunkIndices,
                chatHistoryId: chatHistory._id
            },
            message: 'Response generated successfully'
        });

    } catch(error) {
        next(error);
    }
};

// explain concept from document
// POST /api/ai/explain-concept
// private
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;

        if(!documentId || !concept){
            return res.status(400).json({
                success: false,
                error: 'Please provide both document Id and concept',
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document){
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            });
        }

        // referring to relevant portion of document, to answer the concept 
        const queryEmbedding =
            await generateEmbedding(
                concept
            );

        const relevantChunks =
            await retrieveRelevantChunks(
                document._id,
                queryEmbedding,
                3
            );
        const context = relevantChunks.map(c => c.content).join('\n\n');

        const explanation = await geminiService.explainConcept(concept, context);

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunks: relevantChunks.map(c => c.chunkIndex)
            },
            message: 'Explanation generated successfully'
        });


    } catch(error) {
        next(error);
    }
};

// Get chat history for a doc
// GET /api/ai/chat-history/:documentId
// private
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if(!documentId){
            return res.status(400).json({
                success: false,
                error: 'Please provide document Id',
                statusCode: 400
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId
        }).select('messages'); // only messages array

        if(!chatHistory){
            // not an error
            return res.status(200).json({
                success: false,
                data: [],
                message: 'No chat history found for this document'
            });
        }

        res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully'
        });
    } catch(error) {
        next(error);
    }
};
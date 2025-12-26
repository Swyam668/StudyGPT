import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
// promise-based file system API, so async await can be easily used while using its methods to work with files
import fs from 'fs/promises';
import mongoose from 'mongoose';

// upload PDF document here
// POST /api/documents/upload
// private route
export const uploadDocument = async (req, res, next) => {
    try {

    } catch (error){
        // clean up file on error
        if(req.file){
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
};

// get all documents of user
// GET /api/documents
// private route
export const getDocuments = async (req, res, next) => {

};

// get single document with chunks
// GET /api/documents/:id
// private route
export const getDocument = async (req, res, next) => {

};

// delete document
// DELETE /api/documents/:id
// private route
export const deleteDocument = async (req, res, next) => {

};

// update document
// PUT /api/documents/:id
// private route
export const updateDocument = async (req, res, next) => {

};
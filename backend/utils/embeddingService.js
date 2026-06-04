import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';

console.log(
    "API Key exists:",
    !!process.env.GEMINI_API_KEY
);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateEmbedding = async(text) => {
    const result = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text
    });

    const embedding = result.embeddings[0].values;

    console.log(
        "Embedding length:",
        embedding.length
    );

    return embedding;
};
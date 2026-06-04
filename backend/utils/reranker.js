import { generateText } from './geminiService.js';

export const rerankChunks = async (
    question,
    chunks
) => {

    let chunkText = '';

    chunks.forEach((chunk, index) => {
        chunkText += `
            Chunk ${index}:
            ${chunk.content}

            `;
                });

        const prompt = `
            You are a retrieval reranker.

            Question:
            ${question}

            Chunks:
            ${chunkText}

            Rank all chunks from most relevant to least relevant.

            Return ONLY a JSON array.

            Example:
            [2,0,1,3]

            No explanation.
        `;

    const response =
        await generateText(prompt);

    try {

        const ranking =
            JSON.parse(response.trim());

        return ranking
            .filter(
                index =>
                    index >= 0 &&
                    index < chunks.length
            );

    }
    catch(error){

        console.log(
            "Reranker parse failed"
        );

        return chunks.map(
            (_, index) => index
        );
    }
};
import mongoose from 'mongoose';
import Chunk from '../models/Chunk.js';

export const retrieveRelevantChunks = async (
    documentId,
    queryEmbedding,
    limit = 5
) => {

    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: 'chunk_vector_index',
                path: 'embedding',
                queryVector: queryEmbedding,
                numCandidates: 100,
                limit: limit,
                filter: {
                    documentId: new mongoose.Types.ObjectId(documentId)
                }
            }
        }
    ]);

    return results;
};
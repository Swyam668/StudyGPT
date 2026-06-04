// splitting text into chunks for better AI processing and also to not exceed data limits of API
// basically a text chunker algorithm


// = in here, means default parameter values
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if(!text || text.trim().length === 0)
        return [];

    // PDF has text with mutilple formats for same things, so after parsing we gotta clean it
    // 1. - \r\n == windows-style line break, \n - UNIX style -- so convert all line endings to same format
    // 2. - replace multiple whitespace with one
    // 3. - new line followed by space
    // 4. - space before new line
    const cleanedText = text.replace(/\r\n/g, '\n')
                        .replace(/\s+/g, ' ')
                        .replace(/\n /g, '\n')
                        .replace(/ \n/g, '\n')
                        .trim();
    
    // basically splitting by sentences and filtering out empty sentences -- for better processing                    
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks =[];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    // NOTE -- by overlapping, we relate chunks not paragraphs
    // and chunks are connected by '\n\n' while paragraph words by ' ' (space between words)

    for(const paragraph of paragraphs) {
        // \s -- any whitespace char and \s+ -- multiple white-space chars
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // is current paragraph cant fit into this chunk, then save this current chunk first 
        // for this type of paragraph, create special chunk (no need to relate it with previous)
        if(paragraphWordCount > chunkSize){
            if(currentChunk.length > 0){
                // saving the current chunk by combining it with others with \n\n (for easy differentitaion of chunks)
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                // empty out currentChunk (a temp), as we saved it
                currentChunk = [];
                // reset wordCount
                currentWordCount = 0;
            }
            
            // now, save the current paragraph into chunks
            // -overlap, so that chunks are related
            for(let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                // splitting paragraph into words till chunkSize
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                // push this chunk
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0
                });
                // if para ends at this chunk, break
                if(i + chunkSize >= paragraphWords.length) break;
            }

            // continue for other paras
            continue;
        }

        // if the para does not exceed chunkSize but cant fit in current chunk as well
        // then save the current chunk and move on
        if(currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0){
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            // create overlap from previous chunk
            // re-joining words into string
            const prevChunkText = currentChunk.join(' ');
            const prevWords = prevChunkText.split(/\s+/);
            // text to maintain overlapping of currentChunk (logically previous chunk and in code currentChunk) and current para to be added to chunks
            const overlapText = prevWords.slice(-Math.min(overlap, prevWords.length)).join(' ');

            // add the overlapping text to paragraph
            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
        } else {
            // add paragraph to current chunk
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }
    }

    // adding the last chunk (that is, if something still remains in current chunk)
    if(currentChunk.length > 0){
        chunks.push({
            content: currentChunk.join("\n\n"),
            chunkIndex: chunkIndex,
            pageNumber: 0
        });
    }

    // FALLBACK - if no chunks created, split by words -- to avoid bugs (it wont run almost always) -- defensive strategy
    if(chunks.length === 0 && cleanedText > 0) {
        const allWords = cleanedText.split(/\s+/);
        for(let i = 0; i < allWords.length; i+=(chunkSize-overlap)) {
            const chunkWords = allWords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0
            });

            if(i + chunkSize >= allWords.length) break;
        }
    }

    return chunks;
};


// finding relevant chunks based on keyword matching
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if(!chunks || chunks.length === 0 || !query){
        return [];
    }

    // some common words to exclude
    const stopWords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
        'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
    ]);

    // cleaning query words
    const queryWords = query
                        .toLowerCase()
                        .split(/\s+/)
                        .filter(w => w.length > 2 && !stopWords.has(w));
    
    if(queryWords.length === 0){
        // return clean chunk objects without mongoose metadata
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            // chunks will be saved to database, and mongoose will create id for each of them
            _id: chunk._id,
        }));
    }

    // score chunks on basis of query to find most relevant chunks
    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;
        let score = 0;

        //score each query word
        for(const word of queryWords){
            // \\b is word boundary -- to endure word matches exactly not as a part of some other word
            // g- global -- find all matches, not only one
            // if no match, gotta return array (empty), becoz .match return null
            const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
            // exact word match -- higher score
            score += exactMatches * 3;

            //partial match (lower score)
            const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
            // includes exact matches as well, so gotta subtract
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        // bonus for multiple query words found
        const uniqueWordsFound = queryWords.filter(word =>
            content.includes(word)
        ).length;
        if(uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2;
        }

        // normalised by content length
        const normalizedScore = score / Math.sqrt(contentWords);

        // smaller bonus for earlier chunks
        const positionBonus = 1 - (index/chunks.length) * 0.1;

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: uniqueWordsFound
        };
    });


    return scoredChunks
        .filter(chunk => chunk.score > 0)
        // return negate if a should come before b
        .sort((a, b) => {
            // sorting on basis of score
            if(b.score !== a.score)
                    return b.score - a.score;
            // if same score, who has more mathed words
            if(b.matchedWords !== a.matchedWords)
                    return b.matchedWords - a.matchedWords;
            // if score and matched words same, who comes first
            return a.chunkIndex - b.chunkIndex
        })
        // maxChunks - no of chunks we ought to return
        .slice(0, maxChunks);
};
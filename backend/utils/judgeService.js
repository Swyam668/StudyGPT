// utils/judgeService.js

import { callModel } from "./modelService.js";

export const selectBestResponse = async (
    originalPrompt,
    responses
) => {

    const judgePrompt = `
        You are evaluating AI responses.

        User Prompt:
        ${originalPrompt}

        ${responses.map((r, i) =>
        `Response ${i+1} (${r.model}):

        ${r.response}
        `).join("\n\n")}

        Choose the best response based on:

        1. Accuracy
        2. Completeness
        3. Clarity
        4. Educational value

        Do not explain.
        Do not write anything else.
        Just return the best response as it is.
        No Need to tell which model or response you picked.
    `;

    return await callModel(
        judgePrompt,
        "openai/gpt-4.1-mini"
    );
};
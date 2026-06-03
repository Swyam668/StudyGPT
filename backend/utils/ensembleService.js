// utils/ensembleService.js

import { callModel } from "./modelService.js";
import { selectBestResponse } from "./judgeService.js";

export const getModelResponses = async (prompt) => {

    const models = [
        "google/gemini-2.5-flash",
        "openai/gpt-4.1-mini",
        "deepseek/deepseek-chat-v3"
    ];

    const results = await Promise.all(
        models.map(async (model) => {
            const response = await callModel(prompt, model);

            return {
                model,
                response
            };
        })
    );

    return results.filter(r => r.response);
};

export const generateBestResponse = async (
    prompt
) => {

    const responses =
        await getModelResponses(prompt);

    const bestResponse =
        await selectBestResponse(
            prompt,
            responses
        );

    return {
        bestResponse,
        allResponses: responses
    };
};
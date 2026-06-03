import client from "./aiClient.js";

export const callModel = async (prompt, model) => {
    try {
        const response = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error(`Error calling ${model}`, error);
        return null;
    }
};
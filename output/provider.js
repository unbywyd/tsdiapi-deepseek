import { OpenAI } from "openai";
import { Value } from '@sinclair/typebox/value';
export class DeepSeekProvider {
    openai;
    config;
    constructor() {
    }
    init(config) {
        if (!config.apiKey) {
            throw new Error("❌ DeepSeek API key is required.");
        }
        this.config = config;
        this.openai = new OpenAI({
            apiKey: config.apiKey,
            baseURL: 'https://api.deepseek.com'
        });
    }
    async jsonDTO(prompt, schema, model) {
        if (!this.openai) {
            console.error("❌ DeepSeek is not initialized. Please call init() first.");
            return null;
        }
        try {
            const systemPrompt = `You are a helpful assistant that outputs JSON. Please provide the response in the following JSON schema format: ${JSON.stringify(schema)}`;
            const response = await this.openai.chat.completions.create({
                model: model || this.config.model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });
            const usage = response.usage;
            const message = response.choices[0]?.message;
            const content = message?.content;
            if (!content) {
                console.error("❌ No content in response");
                return null;
            }
            try {
                const result = JSON.parse(content);
                return {
                    result: Value.Decode(schema, result),
                    usage,
                    message
                };
            }
            catch (e) {
                console.error("❌ Failed to parse JSON response:", e);
                return null;
            }
        }
        catch (e) {
            console.error("❌ Error calling DeepSeek API:", e);
            return null;
        }
    }
    async chat(prompt, model) {
        if (!this.openai) {
            console.error("❌ DeepSeek is not initialized. Please call init() first.");
            return null;
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: model || this.config.model,
                messages: [{ role: "user", content: prompt }],
            });
            const message = response.choices[0]?.message;
            return {
                message: message,
                usage: response.usage,
                result: message?.content,
            };
        }
        catch (error) {
            console.error("❌ DeepSeek Chat Error:", error);
            return null;
        }
    }
    async chatString(prompt, model) {
        if (!this.openai) {
            console.error("❌ DeepSeek is not initialized. Please call init() first.");
            return;
        }
        const response = await this.openai.chat.completions.create({
            model: model || this.config.model,
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0]?.message?.content || "";
    }
    async JsonString(prompt, jsonSchema, model) {
        if (!this.openai) {
            console.error("❌ DeepSeek is not initialized. Please call init() first.");
            return null;
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: model || this.config.model,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            return JSON.parse(response.choices[0]?.message?.content || "{}");
        }
        catch (error) {
            console.error("❌ DeepSeek JSON Parsing Error:", error);
            return null;
        }
    }
}
//# sourceMappingURL=provider.js.map
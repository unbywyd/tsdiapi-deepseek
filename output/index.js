import "reflect-metadata";
import { DeepSeekProvider } from "./provider.js";
let deepseekProvider = null;
const defaultConfig = {
    apiKey: "",
    model: "deepseek-chat",
};
class App {
    name = 'tsdiapi-deepseek';
    config;
    context;
    provider;
    constructor(config) {
        this.config = { ...defaultConfig, ...config };
        this.provider = new DeepSeekProvider();
    }
    async onInit(ctx) {
        const logger = ctx.fastify.log;
        if (deepseekProvider) {
            logger.warn("⚠ DeepSeek Plugin is already initialized. Skipping re-initialization.");
            return;
        }
        this.context = ctx;
        const config = ctx.projectConfig;
        this.config.apiKey = config.get('DEEPSEEK_API_KEY', this.config.apiKey);
        this.config.model = config.get('DEEPSEEK_MODEL_ID', this.config.model || defaultConfig.model);
        if (!this.config.apiKey) {
            throw new Error("❌ DeepSeek Plugin is missing an API key.");
        }
        this.provider.init(this.config);
        deepseekProvider = this.provider;
        ctx.fastify.decorate('deepseek', this.provider);
    }
}
export function useDeepSeekProvider() {
    if (!deepseekProvider) {
        throw new Error("❌ DeepSeek Provider is not initialized. Please call init() first.");
    }
    return deepseekProvider;
}
export default function createPlugin(config) {
    return new App(config);
}
//# sourceMappingURL=index.js.map
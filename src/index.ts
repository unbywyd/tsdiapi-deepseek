import "reflect-metadata";
import type { AppContext, AppPlugin } from "@tsdiapi/server";
import { DeepSeekProvider, DeepSeekResponse } from "./provider.js";
import type { FastifyInstance } from "fastify";

let deepseekProvider: DeepSeekProvider | null = null;

export type PluginOptions = {
    apiKey?: string;
    model?: string;
};

declare module "fastify" {
    interface FastifyInstance {
        deepseek: DeepSeekProvider;
    }
}

const defaultConfig: PluginOptions = {
    apiKey: "",
    model: "deepseek-chat",
}

class App implements AppPlugin {
    name = 'tsdiapi-deepseek';
    config: PluginOptions;
    context: AppContext;
    provider: DeepSeekProvider;
    constructor(config?: PluginOptions) {
        this.config = { ...defaultConfig, ...config };
        this.provider = new DeepSeekProvider();
    }
    async onInit(ctx: AppContext) {
        const logger = ctx.fastify.log;
        if (deepseekProvider) {
            logger.warn("⚠ DeepSeek Plugin is already initialized. Skipping re-initialization.");
            return;
        }

        this.context = ctx;
        const config = ctx.projectConfig;

        this.config.apiKey = config.get('DEEPSEEK_API_KEY', this.config.apiKey) as string;
        this.config.model = config.get('DEEPSEEK_MODEL_ID', this.config.model || defaultConfig.model) as string;

        if (!this.config.apiKey) {
            throw new Error("❌ DeepSeek Plugin is missing an API key.");
        }

        this.provider.init(this.config);
        deepseekProvider = this.provider;
        ctx.fastify.decorate('deepseek', this.provider);
    }
}

export function useDeepSeekProvider(): DeepSeekProvider {
    if (!deepseekProvider) {
        throw new Error("❌ DeepSeek Provider is not initialized. Please call init() first.");
    }
    return deepseekProvider;
}

export default function createPlugin(config?: PluginOptions) {
    return new App(config);
}
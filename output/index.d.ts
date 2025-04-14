import "reflect-metadata";
import type { AppContext, AppPlugin } from "@tsdiapi/server";
import { DeepSeekProvider } from "./provider.js";
export type PluginOptions = {
    apiKey?: string;
    model?: string;
};
declare module "fastify" {
    interface FastifyInstance {
        deepseek: DeepSeekProvider;
    }
}
declare class App implements AppPlugin {
    name: string;
    config: PluginOptions;
    context: AppContext;
    provider: DeepSeekProvider;
    constructor(config?: PluginOptions);
    onInit(ctx: AppContext): Promise<void>;
}
export declare function useDeepSeekProvider(): DeepSeekProvider;
export default function createPlugin(config?: PluginOptions): App;
export {};
//# sourceMappingURL=index.d.ts.map
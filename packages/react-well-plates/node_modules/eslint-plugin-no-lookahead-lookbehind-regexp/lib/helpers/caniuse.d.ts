import { analyzeRegExpForLookaheadAndLookbehind, AnalyzeOptions } from "./analyzeRegExpForLookaheadAndLookbehind";
declare type BrowserTarget = {
    target: string;
    browser: string;
    version: string;
};
export declare function collectBrowserTargets(configPath: string, config?: {
    production: string[];
    development: string[];
} | Array<string> | string): {
    targets: BrowserTarget[];
    hasConfig: boolean;
};
export declare function collectUnsupportedTargets(id: string, targets: BrowserTarget[]): BrowserTarget[];
export declare function resolveCaniUseBrowserTarget(target: string): string;
export declare function formatLinterMessage(violators: ReturnType<typeof analyzeRegExpForLookaheadAndLookbehind>, targets: ReturnType<typeof collectUnsupportedTargets>, config: AnalyzeOptions["config"]): string;
export {};
//# sourceMappingURL=caniuse.d.ts.map
import { Rule } from "eslint";
import { AnalyzeOptions } from "../helpers/analyzeRegExpForLookaheadAndLookbehind";
export declare const DEFAULT_OPTIONS: AnalyzeOptions["rules"];
export declare const DEFAULT_CONF: AnalyzeOptions["config"];
export declare const getExpressionsToCheckFromConfiguration: (options: Rule.RuleContext["options"]) => {
    rules: AnalyzeOptions["rules"];
    config: AnalyzeOptions["config"];
};
declare const noLookaheadLookbehindRegexp: Rule.RuleModule;
export { noLookaheadLookbehindRegexp };
//# sourceMappingURL=noLookaheadLookbehindRegex.d.ts.map
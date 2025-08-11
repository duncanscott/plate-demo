import * as ESTree from "estree";
import { Rule } from "eslint";
import { AnalyzeOptions, analyzeRegExpForLookaheadAndLookbehind } from "../helpers/analyzeRegExpForLookaheadAndLookbehind";
import { collectUnsupportedTargets } from "../helpers/caniuse";
export declare function createContextReport(node: ESTree.Literal & Rule.NodeParentExtension, context: Rule.RuleContext, violators: ReturnType<typeof analyzeRegExpForLookaheadAndLookbehind>, targets: ReturnType<typeof collectUnsupportedTargets>, config: AnalyzeOptions["config"]): void;
//# sourceMappingURL=createReport.d.ts.map
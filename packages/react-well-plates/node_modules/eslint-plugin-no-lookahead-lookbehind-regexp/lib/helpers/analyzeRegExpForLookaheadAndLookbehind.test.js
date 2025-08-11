"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noLookaheadLookbehindRegex_1 = require("../rules/noLookaheadLookbehindRegex");
const analyzeRegExpForLookaheadAndLookbehind_1 = require("./analyzeRegExpForLookaheadAndLookbehind");
const groups = ["?=", "?<=", "?!", "?<!"];
describe("analyzeRegExpForLookaheadAndLookbehind", () => {
    it("does not return false positives for an escaped sequence", () => {
        for (const group of groups) {
            expect((0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(`\\(${group}`, (0, noLookaheadLookbehindRegex_1.getExpressionsToCheckFromConfiguration)([]).rules).length).toBe(0);
        }
    });
    it.each([
        ["lookahead", 0, "(?=)"],
        ["negative lookahead", 0, "(?!)"],
        ["lookbehind", 0, "(?<=)"],
        ["negative lookbehind", 0, "(?<!)"],
    ])(`Single match %s - at %i`, (type, position, expression) => {
        expect((0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(expression, (0, noLookaheadLookbehindRegex_1.getExpressionsToCheckFromConfiguration)([]).rules)[0]).toEqual({
            type: type.replace("negative ", ""),
            position: position,
            ...(type.includes("negative") ? { negative: 1 } : {}),
        });
    });
    it.each([
        ["lookahead", 0, 7, "(?=t).*(?=t)"],
        ["negative lookahead", 0, 7, "(?!t).*(?!t)"],
        ["lookbehind", 0, 8, "(?<=t).*(?<=t)"],
        ["negative lookbehind", 0, 8, "(?<!t).*(?<!t)"],
    ])(`Multiple match %s - at %i and %i`, (type, first, second, expression) => {
        expect((0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(expression, (0, noLookaheadLookbehindRegex_1.getExpressionsToCheckFromConfiguration)([]).rules)).toEqual([
            {
                type: type.replace("negative ", ""),
                position: first,
                ...(type.includes("negative") ? { negative: 1 } : {}),
            },
            {
                type: type.replace("negative ", ""),
                position: second,
                ...(type.includes("negative") ? { negative: 1 } : {}),
            },
        ]);
    });
    it.each([
        ["no-lookahead"],
        ["no-negative-lookahead"],
        ["no-lookbehind"],
        ["no-negative-lookbehind"],
    ])("Does not warn if %s rule is disabled", (rule) => {
        const expressions = {
            "no-lookahead": "(?=test)",
            "no-lookbehind": "(?<=test)",
            "no-negative-lookahead": "(?!test)",
            "no-negative-lookbehind": "(?<!test)",
        };
        if (!expressions[rule])
            throw new Error(`No test for ${rule}`);
        for (const expression in expressions) {
            if (rule === expression) {
                expect((0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(expressions[expression], { [expression]: 0 })).toEqual([]);
            }
            else {
                expect((0, analyzeRegExpForLookaheadAndLookbehind_1.analyzeRegExpForLookaheadAndLookbehind)(expressions[expression], (0, noLookaheadLookbehindRegex_1.getExpressionsToCheckFromConfiguration)([]).rules)).toEqual([
                    {
                        position: 0,
                        type: expression.replace("no-", "").replace("negative-", ""),
                        ...(expression.startsWith("no-negative") ? { negative: 1 } : {}),
                    },
                ]);
            }
        }
    });
});

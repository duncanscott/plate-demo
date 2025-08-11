"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = exports.configs = void 0;
const recommended_1 = require("./config/recommended");
const noLookaheadLookbehindRegex_1 = require("./rules/noLookaheadLookbehindRegex");
exports.configs = {
    recommended: recommended_1.recommended,
};
exports.rules = {
    "no-lookahead-lookbehind-regexp": noLookaheadLookbehindRegex_1.noLookaheadLookbehindRegexp,
};

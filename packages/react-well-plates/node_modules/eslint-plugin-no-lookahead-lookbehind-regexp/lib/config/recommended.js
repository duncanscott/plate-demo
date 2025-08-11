"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommended = void 0;
const recommended = {
    plugins: ["no-lookahead-lookbehind-regexp"],
    env: {
        browser: true,
    },
    rules: {
        "no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp": "error",
    },
};
exports.recommended = recommended;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringLiteralRegExp = exports.isRegExpLiteral = void 0;
function isRegExpLiteral(literal) {
    return "regex" in literal;
}
exports.isRegExpLiteral = isRegExpLiteral;
function isStringLiteralRegExp(literal) {
    return (literal.parent !== null &&
        literal.parent.type === "NewExpression" &&
        literal.parent.callee.type === "Identifier" &&
        literal.parent.callee.name === "RegExp");
}
exports.isStringLiteralRegExp = isStringLiteralRegExp;

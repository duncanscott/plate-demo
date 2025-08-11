import { Rule } from "eslint";
import { Literal, RegExpLiteral } from "estree";
export declare function isRegExpLiteral(literal: Literal & Rule.NodeParentExtension): literal is RegExpLiteral & Rule.NodeParentExtension;
export declare function isStringLiteralRegExp(literal: Literal & Rule.NodeParentExtension): boolean;
//# sourceMappingURL=ast.d.ts.map
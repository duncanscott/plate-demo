"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContextReport = void 0;
const caniuse_1 = require("../helpers/caniuse");
function createContextReport(node, context, violators, targets, config) {
    context.report({
        node: node,
        message: (0, caniuse_1.formatLinterMessage)(violators, targets, config),
    });
}
exports.createContextReport = createContextReport;

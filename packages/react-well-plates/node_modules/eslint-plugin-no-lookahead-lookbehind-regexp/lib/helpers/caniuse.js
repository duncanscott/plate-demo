"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLinterMessage = exports.resolveCaniUseBrowserTarget = exports.collectUnsupportedTargets = exports.collectBrowserTargets = void 0;
const browserslist_1 = __importDefault(require("browserslist"));
const lite = __importStar(require("caniuse-lite"));
// Collect all browser targets that may be defined as browserlistrc, eslint, package.json etc.
function collectBrowserTargets(configPath, config) {
    const browserslistConfig = browserslist_1.default.findConfig(configPath);
    const hasConfig = (browserslistConfig && browserslistConfig.defaults.length > 0) || false;
    const targets = new Set();
    function addTarget(target) {
        targets.add(target);
    }
    function transformTarget(t) {
        const [browser, version] = t.split(" ");
        return { target: t, browser, version };
    }
    // Get eslint targets
    if (Array.isArray(config) || typeof config === "string") {
        (0, browserslist_1.default)(config, { path: configPath }).forEach(addTarget);
        // If config is an object, resolve targets from production and development
    }
    else if (typeof config === "object" && config !== null) {
        (0, browserslist_1.default)([...(config.production || []), ...(config.development || [])], {
            path: configPath,
        }).forEach(addTarget);
    }
    // If user had eslint config and also has browserslist config, then merge the two
    if (targets.size > 0 && hasConfig) {
        (0, browserslist_1.default)(undefined, { path: configPath }).forEach(addTarget);
        return { targets: Array.from(targets).map(transformTarget), hasConfig };
    }
    // If they only use an eslint config, then return what we have
    if (targets.size > 0 && !hasConfig) {
        return { targets: Array.from(targets).map(transformTarget), hasConfig };
    }
    // ** Warning
    // If they don't use a browserslist config, then return an empty targets array and disable the use of the regexp lookahead and lookbehind entirely.
    if (!hasConfig) {
        return { targets: [], hasConfig };
    }
    (0, browserslist_1.default)(undefined, { path: configPath }).forEach(addTarget);
    // If we couldnt find anything, return empty targets and indicate that no config was found
    return { targets: Array.from(targets).map(transformTarget), hasConfig };
}
exports.collectBrowserTargets = collectBrowserTargets;
// Returns a list of browser targets that do not support a feature.
// In case feature stats are not found in the database, we will assume that the feature is supported,
// this can result in false positives when querying for versions that may not have been released yet (typo or user mistake)
// Since the equivalent can happen in case of specifying some super old version, the proper way to possibly handle
// this would be to throw an error, but since I dont know how often that happens or if it may cause false positives later on
// if caniuse db changes... I'm leaning towards throwing an error here, but it's not the plugin's responsability to validate browserslist config - opinions are welcome.
// TODO: check if browserslist throws an error lower in the stack if config is invalid, this would likely be the best solution
function collectUnsupportedTargets(id, targets) {
    const data = lite.feature(lite.features[id]);
    if (!data)
        return [];
    const { stats } = data;
    const unsupportedTargets = [];
    for (const target of targets) {
        // If we have no match for the target, we can assume it is supported
        if (!stats[target.browser] || !stats[target.browser][target.version])
            continue;
        if (stats[target.browser][target.version] === "n") {
            unsupportedTargets.push(target);
        }
    }
    return unsupportedTargets;
}
exports.collectUnsupportedTargets = collectUnsupportedTargets;
const HumanReadableBrowserTargets = {
    chrome: "Chrome",
    firefox: "Firefox",
    safari: "Safari",
    ios_saf: "iOS Safari",
    ie: "Internet Explorer",
    ie_mob: "Internet Explorer Mobile",
    edge: "Edge",
    baidu: "Baidu",
    electron: "Electron",
    blackberry_browser: "Blackberry Browser",
    edge_mobile: "Edge Mobile",
    and_uc: "Android UC Browser",
    and_chrome: "Android Chrome",
    and_firefox: "Android Firefox",
    and_webview: "Android Webview",
    and_samsung: "Samsung Browser",
    and_opera: "Opera Android",
    opera: "Opera",
    opera_mini: "Opera Mini",
    opera_mobile: "Opera Mobile",
    node: "Node.js",
    kaios: "KaiOS",
};
function resolveCaniUseBrowserTarget(target) {
    return HumanReadableBrowserTargets[target] || target;
}
exports.resolveCaniUseBrowserTarget = resolveCaniUseBrowserTarget;
function formatLinterMessage(violators, targets, config) {
    // If browser has no targets and we still want to report an error, it means that the feature is banned from use.
    if (!targets.length || config.browserslist === false) {
        if (violators.length === 1) {
            return `Disallowed ${violators[0].negative ? "negative " : ""}${violators[0].type} match group at position ${violators[0].position}`;
        }
        return `Disallowed lookahead and/or lookbehind match groups at positions ${violators
            .map((violator) => violator.position)
            .join(", ")}`;
    }
    const groupedTargets = {};
    for (const target of targets) {
        if (!groupedTargets[target.browser])
            groupedTargets[target.browser] = [];
        groupedTargets[target.browser].push(target.version);
    }
    if (violators.length === 1) {
        return `${Object.keys(groupedTargets)
            .map((g) => `${resolveCaniUseBrowserTarget(g)} ${groupedTargets[g].join(", ")}`)
            .join(", ")}: unsupported ${violators[0].negative ? "negative " : ""}${violators[0].type} match group at position ${violators[0].position}`;
    }
    return `${Object.keys(groupedTargets).map((g) => `${resolveCaniUseBrowserTarget(g)} ${groupedTargets[g].join(", ")}`)}: unsupported lookahead and/or lookbehind match groups at positions ${violators
        .map((violator) => violator.position)
        .join(", ")}`;
}
exports.formatLinterMessage = formatLinterMessage;

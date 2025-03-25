"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};
const currentLevel = levels[config_1.default.logging.level] || levels.info;
const log = (level, ...args) => {
    if (levels[level] <= currentLevel) {
        console[level](...args);
    }
};
const logger = {
    error: (...args) => log('error', ...args),
    warn: (...args) => log('warn', ...args),
    info: (...args) => log('info', ...args),
    debug: (...args) => log('debug', ...args)
};
exports.default = logger;

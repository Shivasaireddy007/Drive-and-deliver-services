"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = __importDefault(require("../data-source"));
const healthRouter = (0, express_1.Router)();
healthRouter.get('/health', async (req, res) => {
    try {
        await data_source_1.default.query('SELECT 1'); // ✅ Ping the database
        res.status(200).json({
            status: 'healthy',
            version: process.env.npm_package_version || 'unknown',
            uptime: process.uptime(),
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message, // ✅ Explicitly cast `error`
        });
    }
});
exports.default = healthRouter;

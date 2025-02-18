"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
class WebSocketService {
    constructor() {
        this.socket = null;
    }
    connect() {
        this.socket = (0, socket_io_client_1.default)(process.env.REACT_APP_WEBSOCKET_URL);
    }
    subscribeToDriverLocation(driverId, callback) {
        if (!this.socket)
            return;
        this.socket.on(`driver-location-${driverId}`, callback);
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
exports.default = new WebSocketService();

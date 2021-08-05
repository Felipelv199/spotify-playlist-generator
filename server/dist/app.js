"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var spotify_routes_1 = __importDefault(require("./routes/spotify.routes"));
var app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use('/spotify', spotify_routes_1.default);
exports.default = app;

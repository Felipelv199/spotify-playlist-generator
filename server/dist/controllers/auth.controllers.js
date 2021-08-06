"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.spotifyAuth = void 0;
var query_string_1 = __importDefault(require("query-string"));
var spotifyAuth = function (req, res) {
    var clientId = process.env.CLIENT_ID;
    var redirectUri = process.env.REDIRECT_URI;
    var scope = 'user-read-private user-read-email';
    var queryParams = query_string_1.default.stringify({
        response_type: 'code',
        redirect_uri: redirectUri,
        client_id: clientId,
        scope: scope,
    });
    // res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
    res.send("https://accounts.spotify.com/authorize?" + queryParams);
};
exports.spotifyAuth = spotifyAuth;
var auth = function () { };
exports.auth = auth;

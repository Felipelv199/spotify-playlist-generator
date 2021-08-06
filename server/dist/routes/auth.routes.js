"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controllers_1 = require("../controllers/auth.controllers");
var router = express_1.Router();
router.get('/spotify', auth_controllers_1.spotifyAuth);
exports.default = router;

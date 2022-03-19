"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const multiparty = require('connect-multiparty');
const MuiltiPartyMiddleware = multiparty({ uploadDir: "./files" });
const router = express_1.default.Router();
router.post("/registration", MuiltiPartyMiddleware, user_controller_1.default.registration);
router.post("/login", MuiltiPartyMiddleware, user_controller_1.default.login);
router.post("/order_product", MuiltiPartyMiddleware, user_controller_1.default.product_order);
router.post("/user-order", MuiltiPartyMiddleware, user_controller_1.default.user_order);
router.post("/check-auth", MuiltiPartyMiddleware, user_controller_1.default.check_auth);
module.exports = router;

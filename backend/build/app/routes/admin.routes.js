"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const multiparty = require('connect-multiparty');
const MuiltiPartyMiddleware = multiparty({ uploadDir: "./files" });
const router = express_1.default.Router();
// Create a new product
router.post("/product-create", MuiltiPartyMiddleware, admin_controller_1.default.create);
// Retrieve
router.get("/get-all-product", admin_controller_1.default.findAll);
// Retrieve a single product with id
router.get("/product/:id", admin_controller_1.default.findOne);
// Update a product with id
router.put("/:id", MuiltiPartyMiddleware, admin_controller_1.default.update);
// Delete a product with id
router.delete("/product/:id", admin_controller_1.default.delete);
router.get("/user-order", admin_controller_1.default.user_order);
router.post("/change-ordersss", MuiltiPartyMiddleware, admin_controller_1.default.change_order);
module.exports = router;

import express from 'express';
import admin from '../controllers/admin.controller';
const multiparty = require('connect-multiparty');
const MuiltiPartyMiddleware = multiparty({uploadDir:"./files"});

const router = express.Router();

// Create a new product
router.post("/product-create", MuiltiPartyMiddleware, admin.create);

// Retrieve
router.get("/get-all-product", admin.findAll);

// Retrieve a single product with id
router.get("/product/:id", admin.findOne);

// Update a product with id
router.put("/:id",MuiltiPartyMiddleware, admin.update);

// Delete a product with id
router.delete("/product/:id", admin.delete);

router.get("/user-order", admin.user_order);
router.post("/change-ordersss",MuiltiPartyMiddleware, admin.change_order);

export = router;

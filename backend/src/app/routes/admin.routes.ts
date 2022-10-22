import express from 'express';
import admin from '../controllers/admin.controller';

const router = express.Router();

// Create a new Tutorial
router.post("/product-create", admin.create);

router.post("/tags-create", admin.tagCreate);

// Retrieve all admin
router.get("/get-all-product", admin.findAll);

// Retrieve a single Tutorial with id
router.get("/product/:id", admin.findOne);

// Update a Tutorial with id
router.put("/product/:id", admin.update);

// Delete a Tutorial with id
router.delete("/product/:id", admin.delete);

export = router;

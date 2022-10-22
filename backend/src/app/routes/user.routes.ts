import express from 'express';
import user from '../controllers/user.controller';
import admin from '../controllers/admin.controller';
const multiparty = require('connect-multiparty');
const MuiltiPartyMiddleware = multiparty({uploadDir:"./files"});

const router = express.Router();

router.post("/registration", MuiltiPartyMiddleware, user.registration);
router.post("/login",MuiltiPartyMiddleware, user.login);
router.post("/order_product", MuiltiPartyMiddleware, user.product_order);
router.post("/user-order",MuiltiPartyMiddleware, user.user_order);
router.post("/check-auth",MuiltiPartyMiddleware,  user.check_auth);
router.post("/tags-create", MuiltiPartyMiddleware ,  admin.tagCreate);
router.get("/all-tags",  admin.findAllTags);
router.get("/tags/:id", admin.findOneTag);
router.put("/tags/:id", admin.updateTag);
router.delete("/tags/:id", admin.deleteTag);
router.post("/shop-create", MuiltiPartyMiddleware,  admin.create);
router.get("/get-all-shop", admin.findAll);
router.get("/product/:id", admin.findOne);
router.put("/product/:id", MuiltiPartyMiddleware, admin.update);

export = router;

import express from 'express';
import user from '../controllers/user.controller';
const multiparty = require('connect-multiparty');
const MuiltiPartyMiddleware = multiparty({uploadDir:"./files"});

const router = express.Router();


router.post("/registration", MuiltiPartyMiddleware, user.registration);
router.post("/login",MuiltiPartyMiddleware, user.login);
router.post("/order_product", MuiltiPartyMiddleware, user.product_order);
router.post("/user-order",MuiltiPartyMiddleware, user.user_order);
router.post("/check-auth",MuiltiPartyMiddleware,  user.check_auth);


export = router;

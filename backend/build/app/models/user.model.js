"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ObjectId = require('MongoDb').ObjectId;
const MongoDb = require("./db");
var nodemailer = require('nodemailer');
require('dotenv').config();
let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_HOST,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
});
// constructor
const Admin = function () {
};
Admin.registration = (type, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    // result(null, data);
    let res = yield MongoDb.doRequest("shop", "users");
    res.find({ email: data.email }).toArray(function (error, resolve) {
        if (error) {
            result(1, error);
            return;
        }
        if (resolve.length != 0) {
            result({ kind: "Email_unique" }, { message: "Email is taaken" });
        }
        else {
            res.insertOne(data, function name(error, response) {
                if (error) {
                    result(null, error);
                }
                else {
                    result(0, { name: data.name, email: data.email, token: data.p_key });
                }
            });
        }
    });
});
Admin.login = (type, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    // result(null, data);
    let res = yield MongoDb.doRequest("shop", "users");
    res.find({ email: data.email, password: data.password }).toArray(function (error, resolve) {
        if (error) {
            result(1, error);
            return;
        }
        if (resolve.length == 0) {
            result({ kind: "failed" }, null);
        }
        else {
            result(null, resolve);
        }
    });
});
Admin.product_order = (type, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield MongoDb.doRequest("shop", "products");
    let res_orders = yield MongoDb.doRequest("shop", "orders_details");
    let res_order_singel = yield MongoDb.doRequest("shop", "orders");
    let datas = JSON.parse(data.data);
    let updateProduct = true;
    let order_id = new Date().getTime();
    let date = new Date();
    let user_pk_id = parseInt(data.p_key);
    let updateData = [];
    datas.map((collection, key) => {
        res.find({ p_key: collection.p_key }).toArray(function (error, resolve) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    result(1, error);
                    return;
                }
                if (parseInt(resolve[0].qty) < 0) {
                    updateProduct = false;
                    result({ kind: "quantity_stock_out" }, resolve[0]);
                    return;
                }
                else {
                    resolve[0].order_id = order_id;
                    resolve[0].date = date;
                    resolve[0].user_pk_id = user_pk_id;
                    delete resolve[0]._id;
                    updateData.push(resolve[0]);
                }
                if (updateProduct && (datas.length == updateData.length)) {
                    updateData.map((up_data, key_) => {
                        var Item = { _id: ObjectId(up_data._id) };
                        let qty = parseInt(up_data.qty) - 1;
                        let upProductData = {
                            $set: { qty: qty }
                        };
                        res.updateOne(Item, upProductData, function name(error, response) {
                            if (error) {
                                result(1, error);
                            }
                        });
                    });
                    res_orders.insertMany(updateData, function name(error, response) {
                        if (error) {
                            result(null, error);
                        }
                        else {
                            let order = {};
                            order.order_id = order_id;
                            order.status = "Processing";
                            order.user_pk_id = user_pk_id;
                            res_order_singel.insert(order, function name(error, response) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    if (error) {
                                        result(null, error);
                                    }
                                    else {
                                        yield transporter.sendMail({
                                            from: process.env.MAIL_FROM,
                                            to: process.env.MAIL_TO,
                                            subject: "New Order Place",
                                            text: "New Order Place",
                                            html: "New Order Place", // html body
                                        });
                                        result(null, true);
                                    }
                                });
                            });
                        }
                    });
                }
            });
        });
    });
});
Admin.user_order = (type, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    let res_user = yield MongoDb.doRequest("shop", "users");
    let res_order_singel = yield MongoDb.doRequest("shop", "orders");
    let res_order_details = yield MongoDb.doRequest("shop", "orders_details");
    res_user.find({ p_key: parseInt(data.token) }).toArray(function (error, resolve_user) {
        if (error) {
            result(1, error);
            return;
        }
        if (resolve_user.length) {
            res_order_singel.find({ user_pk_id: parseInt(data.token) }).toArray(function (error, resolve) {
                if (error) {
                    result(true, error);
                    return;
                }
                let orderID = resolve.map((collection, key) => {
                    return collection.order_id;
                });
                res_order_details.find({ order_id: { $in: orderID } }).toArray(function (error, resolve_order) {
                    if (error) {
                        result(true, error);
                        return;
                    }
                    let orders = resolve.map((collection, key) => {
                        return resolve_order.map((info, key_) => {
                            if (collection.order_id == info.order_id) {
                                let temporary = {};
                                temporary.under_order = info;
                                temporary.order = collection;
                                temporary.user = resolve_user;
                                return temporary;
                            }
                        });
                    });
                    result(null, orders);
                });
            });
        }
        else {
            result({ kind: "login_failed" }, resolve_user);
        }
    });
});
Admin.check_auth = (type, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    let res_user = yield MongoDb.doRequest("shop", "users");
    res_user.find({ p_key: parseInt(data.token) }).toArray(function (error, resolve_user) {
        if (error) {
            result(1, error);
            return;
        }
        if (resolve_user.length == 0) {
        }
        else {
            result({ kind: "login_failed" }, resolve_user);
        }
    });
});
module.exports = Admin;

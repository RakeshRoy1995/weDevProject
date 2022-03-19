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
// constructor
const Admin = function () {
};
Admin.create = (type, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    let table = "";
    if (type == "variant") {
        table = "variant";
    }
    else {
        table = "products";
    }
    let res = yield MongoDb.doRequest("shop", table);
    res.insertOne(data, function name(error, response) {
        if (error) {
            result(null, error);
        }
        else {
            result(0, true);
        }
    });
});
Admin.findById = (type, id, result) => __awaiter(void 0, void 0, void 0, function* () {
    let table = "";
    if (type == "variant") {
        table = "variant";
    }
    else {
        table = "products";
    }
    let res = yield MongoDb.doRequest("shop", table);
    res.find({ _id: ObjectId(id) }).toArray(function (error, resolve) {
        if (error) {
            result(1, error);
            return;
        }
        result(0, resolve);
    });
});
Admin.getAll = (type, result) => __awaiter(void 0, void 0, void 0, function* () {
    let table = "";
    if (type == "variant") {
        table = "variant";
    }
    else {
        table = "products";
    }
    let res = yield MongoDb.doRequest("shop", table);
    res.find().toArray(function (error, resolve) {
        if (error) {
            result(null, error);
            return;
        }
        result(null, resolve);
    });
});
Admin.updateById = (type, id, data, result) => __awaiter(void 0, void 0, void 0, function* () {
    let table = "";
    if (type == "variant") {
        table = "variant";
    }
    else {
        table = "products";
    }
    var Item = { _id: ObjectId(id) };
    let updateData = {
        $set: data
    };
    let res = yield MongoDb.doRequest("shop", table);
    res.updateOne(Item, updateData, function name(error, response) {
        if (error) {
            result(null, error);
        }
        else {
            result(null, true);
        }
    });
});
Admin.change_order = (data, result) => __awaiter(void 0, void 0, void 0, function* () {
    var Item = { order_id: parseInt(data.order_id) };
    let updateData = {
        $set: { status: data.val }
    };
    let res = yield MongoDb.doRequest("shop", "orders");
    res.updateOne(Item, updateData, function name(error, response) {
        if (error) {
            result(null, error);
        }
        else {
            result(null, true);
        }
    });
});
Admin.remove = (type, id, result) => __awaiter(void 0, void 0, void 0, function* () {
    let table = "";
    if (type == "variant") {
        table = "variant";
    }
    else {
        table = "products";
    }
    let res = yield MongoDb.doRequest("shop", table);
    var deleteItem = { _id: ObjectId(id) };
    res.deleteOne(deleteItem, function name(error, response) {
        if (error) {
            result(null, error);
        }
        else if (response.deletedCount == 1) {
            result(null, response);
        }
        else {
            result({ kind: "not_found" }, null);
        }
    });
});
Admin.user_order = (result) => __awaiter(void 0, void 0, void 0, function* () {
    // let res_user = await MongoDb.doRequest("shop", "users")
    let res_order_singel = yield MongoDb.doRequest("shop", "orders");
    let res_order_details = yield MongoDb.doRequest("shop", "orders_details");
    res_order_singel.find().toArray(function (error, resolve) {
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
                        return temporary;
                    }
                });
            });
            result(null, orders);
        });
    });
    // res_user.find({ p_key: parseInt(data.token) }).toArray(function (error:Response, resolve_user:any) {
    //   if (error) {
    //     result(1, error);
    //     return;
    //   }
    //   if (resolve_user.length) {
    //     res_order_singel.find({ user_pk_id: parseInt(data.token) }).toArray(function (error:Response, resolve:any) {
    //       if (error) {
    //         result(true, error);
    //         return;
    //       }
    //       let orderID = resolve.map((collection:any, key:any)=>{
    //           return collection.order_id
    //       })
    //       res_order_details.find({ order_id: {$in : orderID } }).toArray(function (error:Response, resolve_order:any) {
    //         if (error) {
    //           result(true, error);
    //           return;
    //         }
    //         let orders = resolve.map((collection:any, key:any)=>{
    //             return resolve_order.map((info:any, key_:any)=>{
    //               if (collection.order_id == info.order_id ) {
    //                 let temporary : any= {}
    //                 temporary.under_order = info
    //                 temporary.order = collection
    //                 temporary.user = resolve_user
    //                 return temporary
    //               }
    //             })
    //         })
    //         result(null, orders);
    //       });
    //     });
    //   }else{
    //     result({ kind: "login_failed" }, resolve_user);
    //   }
    // });
});
module.exports = Admin;

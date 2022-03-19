"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_model_1 = __importDefault(require("../models/user.model"));
const AdminController = function () {
};
// Create and Save a new product
AdminController.registration = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    let icon = req.query.type == "variant" ? "" : req.files.image.path.replace('files', '');
    icon = icon.replace(/[&\/\\#]/g, '');
    if (req.query.type) {
        req.body.p_key = new Date().getTime();
    }
    else {
        req.body.image = icon;
        req.body.p_key = new Date().getTime();
    }
    // Save Data in the database
    user_model_1.default.registration(req.query.type, req.body, (err, data) => {
        if (err) {
            if (err.kind === "Email_unique") {
                res.status(500).send({
                    message: "Registration Failed. Email has been taken before"
                });
            }
            else {
                res.status(500).send({
                    message: "Something went wrong"
                });
            }
        }
        else
            res.send(data);
    });
};
AdminController.login = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Save Data in the database
    user_model_1.default.login(req.query.type, req.body, (err, data) => {
        if (err) {
            if (err.kind === "failed") {
                res.status(500).send({
                    message: "Wrong Password or email"
                });
            }
            else {
                res.status(500).send({
                    message: "Something went wrong"
                });
            }
        }
        else
            res.send(data);
    });
};
AdminController.product_order = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Save Data in the database
    user_model_1.default.product_order(req.query.type, req.body, (err, data) => {
        if (err) {
            if (err.kind === "quantity_stock_out") {
                res.status(500).send(data);
            }
            else {
                res.status(500).send({
                    message: "Something went wrong"
                });
            }
        }
        else
            res.send(data);
    });
};
AdminController.user_order = (req, res) => {
    user_model_1.default.user_order(req.query.type, req.body, (err, data) => {
        if (err) {
            if (err.kind === "login_failed") {
                res.status(500).send({ message: "Login Failed" });
            }
            else {
                res.status(500).send({
                    message: "Something went wrong"
                });
            }
        }
        else
            res.send(data);
    });
};
AdminController.check_auth = (req, res) => {
    user_model_1.default.check_auth(req.query.type, req.body, (err, data) => {
        if (err) {
            if (err.kind === "login_failed") {
                res.status(500).send({ message: "Login Failed" });
            }
            else {
                res.status(500).send({
                    message: "Something went wrong"
                });
            }
        }
        else
            res.send(data);
    });
};
module.exports = AdminController;

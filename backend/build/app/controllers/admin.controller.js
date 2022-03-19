"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const admin_model_1 = __importDefault(require("../models/admin.model"));
const AdminController = function () {
};
// Create and Save a new product
AdminController.create = (req, res) => {
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
    admin_model_1.default.create(req.query.type, req.body, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Product."
            });
        else
            res.send(data);
    });
};
// Retrieve all Data from the database (with condition).
AdminController.findAll = (req, res) => {
    admin_model_1.default.getAll(req.query.type, (err, data) => {
        if (err)
            res.status(500).send({
                message: "Some error occurred while retrieving Data."
            });
        else
            res.send(data);
    });
};
// Find a single product by Id
AdminController.findOne = (req, res) => {
    admin_model_1.default.findById(req.query.type, req.params.id, (err, data) => {
        if (err) {
            res.status(404).send({
                message: `Not found Product with id ${req.params.id}.`
            });
        }
        else
            res.send(data);
    });
};
// Update a product identified by the id in the request
AdminController.update = (req, res) => {
    var _a, _b, _c;
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(1233333333333);
    if (req.files.image && req.files.image.size) {
        let icon = (_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.replace('files', '');
        icon = icon.replace(/[&\/\\#]/g, '');
        req.body.image = icon;
    }
    admin_model_1.default.updateById(req.query.type, req.params.id, req.body, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error updating product with id " + req.params.id
            });
        }
        else
            res.send(data);
    });
};
// Delete a data with the specified id in the request
AdminController.delete = (req, res) => {
    admin_model_1.default.remove(req.query.type, req.params.id, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Could not delete  with id " + req.params.id
            });
        }
        else
            res.send({ message: `deleted successfully!` });
    });
};
AdminController.user_order = (req, res) => {
    admin_model_1.default.user_order((err, data) => {
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
AdminController.change_order = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(4444444464);
    admin_model_1.default.change_order(req.body, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Error updating product with id " + req.params.id
            });
        }
        else
            res.send(data);
    });
};
module.exports = AdminController;

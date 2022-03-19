"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_routes_1 = __importDefault(require("./app/routes/admin.routes"));
const user_routes_1 = __importDefault(require("./app/routes/user.routes"));
require('dotenv').config();
const cors = require("cors");
const app = (0, express_1.default)();
// Files location
app.use('/static', express_1.default.static('files'));
app.use(cors());
// parse requests of content-type - application/json
app.use(express_1.default.json()); /* bodyParser.json() is deprecated */
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */
// simple route
app.use('/admin', admin_routes_1.default);
app.use('/', user_routes_1.default);
// set port, listen for requests
const PORT = process.env.PORT || 6657;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

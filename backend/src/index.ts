import express from 'express';
import adminRoutes from './app/routes/admin.routes';
import UserRoutes from './app/routes/user.routes';
require('dotenv').config()
const cors = require("cors");
const app = express();

// Files location
app.use('/static', express.static('files'))

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route

app.use('/admin', adminRoutes);
app.use('/', UserRoutes);


// set port, listen for requests
const PORT = process.env.PORT || 6657;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

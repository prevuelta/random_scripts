'use strict';

/* CORE */
let path = require('path');
let fs = require('fs');

/* EXPRESS */
let express = require('express');
let bodyParser = require('body-parser');

/* SESSION */
let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
let session = require('express-session');

/* CONSTANTS */

const SITE_DIR = path.join(__dirname, '../../dist');
const DATA_DIR = path.join(__dirname, '../../data');


/* -- APP --*/

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(express.static(SITE_DIR + '/public'));

/* Admin */
app.listen(8000, () => {
    console.log("Server running on port 5000");
})

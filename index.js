'use strict'
const app = require('./configs/app');
const mongodb = require('./configs/mongodb');
const port = 3200;

mongodb.init();
app.listen(port, () => {
    console.log(`Server run to port ${port}`);
});
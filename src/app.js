const mongoose = require('./config/mongoose');
const http = require('http');
const app = require('./config/express');
const { env, port } = require('./config/vars');

if (env === "production") {
    // prodcution 
} else{
    const httpServer = http.createServer(app);
    httpServer.listen(port, () => console.log(`server started on port ${port} (${env})`));
}

mongoose.connect();

module.exports = app;

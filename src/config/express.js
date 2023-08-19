const express = require('express');
const compress = require('compression');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('../routes/v1');
const methodOverride = require('method-override');
const helmet = require('helmet');
const { getImage } = require('../utils/file');

app.use(cors());
app.use(methodOverride());
app.use(compress());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next()
})
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

app.use('/images/:key',getImage)
app.use('/api/v1', routes);


module.exports = app;
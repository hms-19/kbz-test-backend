const express = require('express');
const router = express.Router();
const tagRoutes = require('./tags.route');
const categoryRoutes = require('./categories.route');
const blogRoutes = require('./blogs.route');

router.get('/', async (req, res) => {

    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    console.log("requester ip", ip);
   
    return res.send({ status: 0, message: "This is KBZ Backend Api V1", "ip": ip});

});

router.use('/tags',tagRoutes)
router.use('/categories',categoryRoutes)
router.use('/blogs',blogRoutes)


module.exports = router;

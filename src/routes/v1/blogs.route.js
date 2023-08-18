const express = require('express');
const router = express.Router();
const controller = require('../../controllers/blogs.controller');

router.post('/list',controller.list)
router.post('/create',controller.create)
router.post('/detail',controller.detail)
router.post('/update',controller.update)
router.post('/delete',controller.delete)

module.exports = router

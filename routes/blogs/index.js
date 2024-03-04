const express = require('express');
const router = express.Router();

const controller = require('./index.controller');

router.get('/', controller.getBlogs)
router.get('/create', controller.getCreateBlog)
router.post('/create', controller.postCreateBlog)
router.get('/:id', controller.getBlog)

module.exports = router;
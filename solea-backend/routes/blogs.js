const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogBySlug } = require('../controllers/blogController');

// @route   GET /api/blogs
// @query   lang - Optional language filter ('en' or 'fr')
router.get('/', getAllBlogs);

// @route   GET /api/blogs/:slug
// @query   lang - Optional language filter
router.get('/:slug', getBlogBySlug);

module.exports = router;

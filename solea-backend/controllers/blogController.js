const { getAllBlogPosts, getBlogPostBySlug } = require('../services/sanityService');

// @desc    Get all blog posts from Sanity CMS
// @route   GET /api/blogs
// @query   lang - Optional language filter ('en' or 'fr')
const getAllBlogs = async (req, res) => {
  try {
    const { lang } = req.query;

    // Validate language parameter
    const validLangs = ['en', 'fr'];
    const language = validLangs.includes(lang) ? lang : null;

    const posts = await getAllBlogPosts(language);

    res.json({
      results: posts,
      count: posts.length,
      language: language || 'all'
    });
  } catch (err) {
    console.error('Error fetching blogs from Sanity:', err);
    res.status(500).json({
      message: 'Failed to load blogs',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Get a single blog post by slug from Sanity CMS
// @route   GET /api/blogs/:slug
// @query   lang - Optional language filter
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    if (!slug) {
      return res.status(400).json({ message: 'Slug is required' });
    }

    const validLangs = ['en', 'fr'];
    const language = validLangs.includes(lang) ? lang : null;

    const post = await getBlogPostBySlug(slug, language);

    if (!post) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('Error fetching blog from Sanity:', err);
    res.status(500).json({
      message: 'Failed to load blog',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug
};

/**
 * Sanity CMS Service
 * Fetches blog posts from Sanity using GROQ queries
 */

const { createClient } = require('@sanity/client');

// Initialize Sanity client
const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID || 'ya4shhoi',
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
    token: process.env.SANITY_READ_TOKEN || undefined,
    useCdn: true, // Use CDN for faster reads
});

/**
 * Build image URL from Sanity image reference
 */
const buildImageUrl = (image) => {
    if (!image?.asset?._ref) return null;

    // Parse the asset reference: image-{id}-{dimensions}-{format}
    const ref = image.asset._ref;
    const [, id, dimensions, format] = ref.split('-');

    const projectId = process.env.SANITY_PROJECT_ID || 'ya4shhoi';
    const dataset = process.env.SANITY_DATASET || 'production';

    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
};

/**
 * Get all blog posts with optional language filter
 * @param {string} lang - Language filter ('en' or 'fr')
 * @returns {Promise<Array>} Array of blog posts
 */
const getAllBlogPosts = async (lang = null) => {
    try {
        // GROQ query with optional language filter
        const langFilter = lang ? `&& language == "${lang}"` : '';

        const query = `*[_type == "blogPost" ${langFilter}] | order(publishedAt desc) {
            title,
            "slug": slug.current,
            excerpt,
            "coverImageUrl": coverImage.asset->url,
            tags,
            country,
            city,
            language,
            publishedAt,
            readingTime,
            authorName
        }`;

        const posts = await client.fetch(query);

        // Normalize response and build image URLs
        return posts.map(post => ({
            ...post,
            coverImageUrl: post.coverImageUrl || buildImageUrl(post.coverImage),
            // Map to legacy field names for backwards compatibility
            image: post.coverImageUrl || buildImageUrl(post.coverImage),
            category: post.tags?.[0] || 'Travel',
            date: post.publishedAt,
        }));
    } catch (error) {
        console.error('Sanity fetch error:', error);
        throw error;
    }
};

/**
 * Get a single blog post by slug
 * @param {string} slug - Blog post slug
 * @param {string} lang - Language filter (optional)
 * @returns {Promise<Object>} Blog post detail
 */
const getBlogPostBySlug = async (slug, lang = null) => {
    try {
        const langFilter = lang ? `&& language == "${lang}"` : '';

        const query = `*[_type == "blogPost" && slug.current == $slug ${langFilter}][0] {
            title,
            "slug": slug.current,
            excerpt,
            "coverImageUrl": coverImage.asset->url,
            content,
            tags,
            country,
            city,
            language,
            publishedAt,
            readingTime,
            authorName
        }`;

        const post = await client.fetch(query, { slug });

        if (!post) return null;

        return {
            ...post,
            coverImageUrl: post.coverImageUrl || buildImageUrl(post.coverImage),
            image: post.coverImageUrl || buildImageUrl(post.coverImage),
            category: post.tags?.[0] || 'Travel',
            date: post.publishedAt,
        };
    } catch (error) {
        console.error('Sanity fetch error:', error);
        throw error;
    }
};

module.exports = {
    getAllBlogPosts,
    getBlogPostBySlug,
    client,
};

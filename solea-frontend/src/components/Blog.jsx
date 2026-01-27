import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { BASE_URL } from '../config';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current language
  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/blogs?lang=${currentLang}`);
        // Handle both old format (array) and new format ({ results: [] })
        const data = response.data.results || response.data;
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError(t('blog.error') || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentLang, t]);

  // Format date based on current language
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Handle blog click
  const handleBlogClick = (blog) => {
    if (blog.slug) {
      navigate(`/blogs/${blog.slug}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div id="blog" className="bg-black text-white px-5 md:px-32 py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="oswald text-6xl font-bold">{t('blog.title') || 'Blogs'}</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative bg-zinc-800 animate-pulse w-full h-[500px] rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div id="blog" className="bg-black text-white px-5 md:px-32 py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="oswald text-6xl font-bold">{t('blog.title') || 'Blogs'}</h1>
        </div>
        <div className="text-center py-20">
          <p className="text-rose-400 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors oswald"
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (blogs.length === 0) {
    return (
      <div id="blog" className="bg-black text-white px-5 md:px-32 py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="oswald text-6xl font-bold">{t('blog.title') || 'Blogs'}</h1>
        </div>
        <div className="text-center py-20">
          <p className="text-white/60 text-xl">{t('blog.empty') || 'No blogs found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="blog" className="bg-black text-white px-5 md:px-32 py-16">
      <div className="flex justify-between items-center mb-10">
        <h1 className="oswald text-6xl font-bold">{t('blog.title') || 'Blogs'}</h1>
        <button className="oswald px-6 py-3 text-white border-2 border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-md">
          {t('blog.viewAll') || 'View All'}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {blogs.map((blog, index) => (
          <div
            key={blog.slug || index}
            className="relative bg-cover bg-center w-full h-[500px] rounded-lg overflow-hidden cursor-pointer group"
            style={{ backgroundImage: `url(${blog.coverImageUrl || blog.image})` }}
            onClick={() => handleBlogClick(blog)}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Category & Date badge */}
            <div className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-md flex gap-2 items-center shadow-lg oswald">
              <span>•</span>
              <span>{blog.category || blog.tags?.[0] || 'Travel'}</span>
              <span>{formatDate(blog.publishedAt || blog.date)}</span>
              <span>•</span>
            </div>

            {/* Location badge */}
            {(blog.city || blog.country) && (
              <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm oswald">
                📍 {[blog.city, blog.country].filter(Boolean).join(', ')}
              </div>
            )}

            {/* Title & Excerpt */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white px-4 py-3 rounded-md backdrop-blur-sm">
              <h2 className="text-lg font-semibold oswald">{blog.title}</h2>
              {blog.excerpt && (
                <p className="text-white/70 text-sm mt-1 line-clamp-2">{blog.excerpt}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

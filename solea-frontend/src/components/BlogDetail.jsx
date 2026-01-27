import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PortableText } from "@portabletext/react";
import axios from "axios";
import { BASE_URL } from '../config';

/**
 * Custom components for rendering Portable Text blocks
 */
const portableTextComponents = {
    block: {
        h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-white mt-8 mb-4 oswald">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-bold text-white mt-6 mb-3 oswald">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-bold text-white mt-4 mb-2 oswald">{children}</h4>
        ),
        normal: ({ children }) => (
            <p className="text-white/80 text-lg leading-relaxed mb-4">{children}</p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-400 pl-4 italic text-white/70 my-6">
                {children}
            </blockquote>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        underline: ({ children }) => <span className="underline">{children}</span>,
        link: ({ value, children }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline transition-colors"
            >
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }) => (
            <div className="my-8 rounded-lg overflow-hidden">
                <img
                    src={value?.asset?.url || ''}
                    alt={value?.alt || 'Blog image'}
                    className="w-full h-auto"
                />
            </div>
        ),
    },
};

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;

            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${BASE_URL}/api/blogs/${slug}?lang=${currentLang}`);
                setBlog(response.data);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
                if (err.response?.status === 404) {
                    setError(t('blog.notFound') || 'Blog not found');
                } else {
                    setError(t('blog.error') || 'Failed to load blog');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug, currentLang, t]);

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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white px-5 md:px-32 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-800 rounded w-1/4 mb-4" />
                        <div className="h-12 bg-zinc-800 rounded w-3/4 mb-6" />
                        <div className="h-[400px] bg-zinc-800 rounded mb-8" />
                        <div className="space-y-4">
                            <div className="h-4 bg-zinc-800 rounded w-full" />
                            <div className="h-4 bg-zinc-800 rounded w-full" />
                            <div className="h-4 bg-zinc-800 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !blog) {
        return (
            <div className="min-h-screen bg-black text-white px-5 md:px-32 py-16 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-rose-400 text-2xl mb-4">{error || 'Blog not found'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors oswald"
                    >
                        {t('common.goBack') || 'Go Back'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Image */}
            <div
                className="relative h-[50vh] md:h-[60vh] bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.coverImageUrl || blog.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors flex items-center gap-2"
                >
                    <span>←</span>
                    <span className="oswald">{t('common.back') || 'Back'}</span>
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 md:px-32 pb-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-sm oswald"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold oswald mb-4">{blog.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-white/70">
                            {blog.authorName && (
                                <span className="oswald">✍️ {blog.authorName}</span>
                            )}
                            {(blog.publishedAt || blog.date) && (
                                <span className="oswald">📅 {formatDate(blog.publishedAt || blog.date)}</span>
                            )}
                            {blog.readingTime && (
                                <span className="oswald">⏱️ {blog.readingTime} min read</span>
                            )}
                            {(blog.city || blog.country) && (
                                <span className="oswald">📍 {[blog.city, blog.country].filter(Boolean).join(', ')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 md:px-32 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p className="text-xl text-white/80 italic border-l-4 border-amber-400 pl-4 mb-8">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Portable Text Content */}
                    {blog.content && Array.isArray(blog.content) ? (
                        <div className="prose prose-invert max-w-none">
                            <PortableText
                                value={blog.content}
                                components={portableTextComponents}
                            />
                        </div>
                    ) : (
                        <p className="text-white/60 text-center py-8">
                            {t('blog.noContent') || 'No content available'}
                        </p>
                    )}

                    {/* Back to blogs */}
                    <div className="mt-12 pt-8 border-t border-white/10 text-center">
                        <button
                            onClick={() => navigate('/#blog')}
                            className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors oswald"
                        >
                            {t('blog.backToBlogs') || '← Back to Blogs'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;

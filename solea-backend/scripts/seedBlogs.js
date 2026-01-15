const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Blog = require('../models/blogModel');

const MONGO_URI = process.env.MONGO_URI;

const seedBlogs = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('🗑️  Cleared existing blogs');

        // Read blog data
        const blogsPath = path.join(__dirname, '../Data/blogs.json');
        const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

        // Insert blogs
        const result = await Blog.insertMany(blogsData);
        console.log(`✅ Inserted ${result.length} blogs`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        console.log('🎉 Blog seeding complete!');
    } catch (err) {
        console.error('❌ Error seeding blogs:', err.message);
        process.exit(1);
    }
};

seedBlogs();

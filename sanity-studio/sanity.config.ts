import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { blogPost } from './schemas/blogPost'

export default defineConfig({
    name: 'itinera-blog',
    title: 'Itinera Travel Blog',

    projectId: 'ya4shhoi',
    dataset: 'production',

    plugins: [structureTool(), visionTool()],

    schema: {
        types: [blogPost],
    },
})

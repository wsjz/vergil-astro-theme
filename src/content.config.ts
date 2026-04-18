import { glob } from 'astro/loaders';
import { defineCollection, z, type ImageFunction } from 'astro:content';

const imageSchema = (image: ImageFunction) =>
    z.object({
        src: image(),
        alt: z.string().optional()
    });

const seoSchema = (image: ImageFunction) =>
    z.object({
        title: z.string().min(5).max(120).optional(),
        description: z.string().min(15).max(160).optional(),
        image: imageSchema(image).optional(),
        pageType: z.enum(['website', 'article']).default('website')
    });

const fontsSchema = z.object({
    display: z.string().optional(),
    body: z.string().optional()
}).optional();

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            excerpt: z.string().optional(),
            publishDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            isFeatured: z.boolean().default(false),
            tags: z.array(z.string()).default([]),
            category: z.string().optional(),
            series: z.string().optional(),
            draft: z.boolean().default(false),
            seo: seoSchema(image).optional(),
            fonts: fontsSchema
        })
});

const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            seo: seoSchema(image).optional(),
            fonts: fontsSchema
        })
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            publishDate: z.coerce.date(),
            isFeatured: z.boolean().default(false),
            seo: seoSchema(image).optional(),
            fonts: fontsSchema
        })
});

const albums = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/albums' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            date: z.coerce.date(),
            cover: image().optional(),
            images: z.array(
                z.object({
                    src: image(),
                    alt: z.string().optional()
                })
            ).default([]),
            tags: z.array(z.string()).default([]),
            fonts: fontsSchema
        })
});

const docs = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: () =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            icon: z.string().optional(),
            order: z.number().default(99),
            dirs: z.record(z.string(), z.string()).optional(),
            excerpt: z.string().optional(),
            draft: z.boolean().default(false)
        })
});

const resume = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/resume' }),
    schema: () =>
        z.object({
            title: z.string(),
            name: z.string(),
            avatar: z.string().optional(),
            contact: z.object({
                email: z.string().optional(),
                phone: z.string().optional(),
                location: z.string().optional(),
                website: z.string().optional()
            }).optional()
        })
});

export const collections = { blog, pages, projects, albums, docs, resume };

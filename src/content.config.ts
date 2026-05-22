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
            banner: z.string().optional(),
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

const photoSchema = (image: ImageFunction) =>
    z.object({
        src: image(),
        alt: z.string().optional(),
        caption: z.string().optional(),
        season: z.enum(['spring', 'summer', 'autumn', 'winter']).optional(),
        featured: z.boolean().default(false),
        exif: z.object({
            camera: z.string().optional(),
            lens: z.string().optional(),
            focal: z.string().optional(),
            aperture: z.string().optional(),
            shutter: z.string().optional(),
            iso: z.string().optional(),
            datetime: z.string().optional()
        }).optional()
    });

const albums = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/albums' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            date: z.coerce.date(),
            cover: image().optional(),
            images: z.array(photoSchema(image)).default([]),
            tags: z.array(z.string()).default([]),
            fonts: fontsSchema,
            theme: z.enum(['golden', 'seasons']).default('golden').optional(),
            layout: z.enum(['grid', 'masonry', 'timeline', 'carousel']).default('grid').optional(),
            photoFit: z.enum(['cover', 'contain', 'auto']).default('cover').optional(),
            background: z.string().optional(),
            accent: z.string().optional(),
            seasonFilter: z.boolean().default(false).optional(),
            seasonDefault: z.enum(['spring', 'summer', 'autumn', 'winter']).optional()
        })
});

const docs = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            subtitle: z.string().optional(),
            description: z.string().optional(),
            icon: z.string().optional(),
            order: z.number().default(99),
            dirs: z.lazy(() =>
                z.array(
                    z.union([
                        z.string(),
                        z.record(
                            z.string(),
                            z.union([z.array(z.string()), z.null(), z.undefined()]).optional()
                        )
                    ])
                )
            ).optional(),
            excerpt: z.string().optional(),
            autoRender: z.boolean().default(true).optional(),
            draft: z.boolean().default(false),
            homepage: z.string().optional(),
            tags: z.array(z.string()).default([]),
            cover: image().optional(),
            banner: z.string().optional(),
            splash: z.object({
                enabled: z.boolean().default(false),
                backgroundImage: z.string().optional(),
                overlay: z.string().optional(),
                textShadow: z.boolean().default(true),
                buttonText: z.string().default('开始阅读'),
                fallbackBg: z.string().optional(),
                gradientColor: z.string().optional(),
                gradientHeight: z.string().default('h-56'),
                backdropBlur: z.string().default('12px')
            }).optional()
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

const thoughts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/thoughts' }),
    schema: () =>
        z.object({
            date: z.coerce.date(),
            tags: z.array(z.string()).default([])
        })
});

export const collections = { blog, pages, projects, albums, docs, resume, thoughts };

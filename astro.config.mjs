import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { transformerNotationDiff, transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import siteConfig from './src/data/site-config';
import { rehypeMathDispatcher } from './src/plugins/rehype-math-dispatcher.mjs';
import { rehypeTitleHeadings } from './src/plugins/rehype-title-headings.mjs';
import { remarkContentDirectives } from './src/plugins/directives/index.mjs';
import { remarkImageDirectives } from './src/plugins/remark-image-directives.mjs';
import { remarkPhotoDirectives } from './src/plugins/remark-photo-directives.mjs';
import { remarkTerminal, transformerTerminal } from './src/plugins/shiki-terminal.mjs';

export default defineConfig({
    site: siteConfig.website,
    image: {
        domains: ['images.unsplash.com']
    },
    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ['mermaid', 'echarts'],
        },
    },
    integrations: [sitemap(), icon()],
    markdown: {
        remarkPlugins: [remarkDirective, remarkMath, remarkImageDirectives, remarkPhotoDirectives, [remarkContentDirectives, { links: siteConfig.links, screenshotService: siteConfig.screenshotService }], remarkTerminal],
        rehypePlugins: [rehypeMathDispatcher, rehypeTitleHeadings],
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark'
            },
            transformers: [
                transformerTerminal(),
                transformerNotationDiff(),
                transformerNotationHighlight(),
                transformerNotationWordHighlight()
            ],
            wrap: true
        }
    }
});
// force rebuild 1778340556

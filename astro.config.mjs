import sitemap from '@astrojs/sitemap';
import { transformerNotationDiff, transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import siteConfig from './src/data/site-config';
import { rehypeTitleHeadings } from './src/plugins/rehype-title-headings.mjs';
import { remarkContentDirectives } from './src/plugins/remark-content-directives.mjs';
import { remarkTerminal, transformerTerminal } from './src/plugins/shiki-terminal.mjs';

export default defineConfig({
    site: siteConfig.website,
    image: {
        service: {
            entrypoint: 'astro/assets/services/noop'
        }
    },
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [sitemap()],
    markdown: {
        remarkPlugins: [remarkDirective, remarkContentDirectives, remarkTerminal],
        rehypePlugins: [rehypeTitleHeadings],
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

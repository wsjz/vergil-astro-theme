/**
 * Rehype plugin to dispatch math rendering based on frontmatter.
 *
 * Frontmatter controls:
 *   mathjax: true  → use MathJax (SVG output)
 *   katex: true    → use KaTeX (HTML+CSS output)
 *   both true      → MathJax takes priority
 *   neither        → preserve raw $...$ / $$...$$ text
 *
 * Depends on: remark-math (must be in remarkPlugins)
 */
import rehypeKatex from 'rehype-katex';
import rehypeMathjax from 'rehype-mathjax';
import { visit } from 'unist-util-visit';

const katexTransformer = rehypeKatex();
const mathjaxTransformer = rehypeMathjax();

/** @type {string} */
const MATH_INLINE_CLASS = 'math-inline';
/** @type {string} */
const MATH_DISPLAY_CLASS = 'math-display';
/** @type {string} */
const LANG_MATH = 'language-math';

/**
 * Restore math nodes to raw text when no engine is enabled.
 * Inline:  <code class="language-math math-inline">...</code> → "$...$"
 * Block:   <pre><code class="language-math math-display">...</code></pre> → "$$...$$"
 */
function restoreMathNodes(tree) {
    visit(tree, 'element', (node, index, parent) => {
        if (!parent || node.tagName !== 'code') return;

        const classes = node.properties?.className || [];
        if (!classes.includes(LANG_MATH)) return;

        const isDisplay = classes.includes(MATH_DISPLAY_CLASS);
        const textNode = node.children?.find((c) => c.type === 'text');
        const content = textNode?.value || '';
        const delimiter = isDisplay ? '$$' : '$';

        // Replace the node with raw text
        const replacement = { type: 'text', value: delimiter + content + delimiter };

        if (isDisplay && parent.tagName === 'pre') {
            // Replace the whole <pre> block
            const grandParent = parent;
            const preIndex = grandParent.children.indexOf(parent);
            if (preIndex !== -1) {
                grandParent.children.splice(preIndex, 1, replacement);
                return [visit.SKIP, preIndex];
            }
        } else {
            // Replace inline <code>
            parent.children.splice(index, 1, replacement);
            return [visit.SKIP, index];
        }
    });
}

/**
 * Dispatch to MathJax or KaTeX based on frontmatter.
 *
 * @returns {(tree: import('hast').Root, file: import('vfile').VFile) => void}
 */
export function rehypeMathDispatcher() {
    return (tree, file) => {
        // Read frontmatter from Astro's vfile data
        const fm = file.data?.astro?.frontmatter || {};
        const useMathjax = fm.mathjax === true;
        const useKatex = fm.katex === true;

        if (useMathjax) {
            mathjaxTransformer(tree, file);
        } else if (useKatex) {
            katexTransformer(tree, file);
        } else {
            // Neither enabled: restore raw delimiters
            restoreMathNodes(tree);
        }
    };
}

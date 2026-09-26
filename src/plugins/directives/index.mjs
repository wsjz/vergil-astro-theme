/**
 * Remark content directives main entry.
 *
 * Aggregates all directive processors into a unified remark plugin.
 */
import { visit } from 'unist-util-visit';
import { processInlineDirective } from './inline.mjs';
import { processBlockDirective } from './blocks.mjs';
import { processOkrDirective } from './okr.mjs';
import { processCardDirective } from './cards.mjs';
import { processMediaDirective } from './media.mjs';
import { processPrivateDirective } from './private.mjs';
import { processChartDirective } from './charts.mjs';
import { processCalendarDirective } from './calendar.mjs';
import { processStoryDirective } from './story.mjs';
import { processMindDirective } from './mind.mjs';

export function remarkContentDirectives(options = {}) {
    return (tree) => {
        visit(tree, 'textDirective', (node) => {
            processInlineDirective(node);
        });

        visit(tree, 'containerDirective', (node) => {
            const name = node.name;
            const blockNames = ['callout', 'note', 'folding', 'folders', 'timeline', 'tabs', 'grid', 'blockquote', 'quot', 'title', 'poetry', 'copy', 'reel', 'paper', 'deadline', 'plan'];
            const cardNames = ['ghcard', 'sites', 'posters', 'panel', 'yoicard'];
            const mediaNames = ['video', 'audio'];
            const chartNames = ['mermaid', 'echart'];
            const planNames = ['calendar'];

            if (blockNames.includes(name)) {
                processBlockDirective(node, options);
            } else if (name === 'okr') {
                processOkrDirective(node, options);
            } else if (cardNames.includes(name)) {
                processCardDirective(node, options);
            } else if (mediaNames.includes(name)) {
                processMediaDirective(node, options);
            } else if (chartNames.includes(name)) {
                processChartDirective(node, options);
            } else if (planNames.includes(name)) {
                processCalendarDirective(node, options);
            } else if (name === 'private') {
                processPrivateDirective(node, options);
            } else if (name === 'story') {
                processStoryDirective(node, options);
            } else if (name === 'mind') {
                processMindDirective(node, options);
            }
        }, true);
    };
}

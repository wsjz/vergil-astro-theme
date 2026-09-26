#!/usr/bin/env node
/**
 * 统计指令数量，并核对文档里标称的数字是否还对得上。
 *
 * 文档里写「N 个指令」是给读者看的有用信息，但手写的数字会过期
 * （曾经文件名写 5 个、总数写 30+ 和 36+，实际是 46 个）。
 * 加指令之后跑一次：node scripts/count-directives.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const read = (p) => fs.readFileSync(p, 'utf-8');
const P = 'src/plugins';
const DOCS = 'src/content/docs/vergil-guide/03-基本创作/内容指令';

// 代码里的全集
const idx = read(`${P}/directives/index.mjs`);
const container = new Set();
for (const m of idx.matchAll(/const \w+Names = \[([^\]]+)\]/g)) {
    for (const x of m[1].split(',')) container.add(x.trim().replace(/['"]/g, ''));
}
for (const m of idx.matchAll(/name === '(\w+)'/g)) container.add(m[1]);

const inline = new Set(
    [...read(`${P}/directives/inline.mjs`).matchAll(/case '([\w-]+)'/g)].map((m) => m[1])
);

// 图片类指令在独立插件里
const image = new Set(['image', 'gallery', 'banner', 'photo']);

const all = new Set([...container, ...inline, ...image]);

// 文档各分类实际讲了多少（以「## 标题（指令名）」为准）
const perDoc = {};
for (const f of fs.readdirSync(DOCS).filter((f) => f.endsWith('.md') && f !== 'index.md')) {
    const s = read(path.join(DOCS, f));
    const names = new Set();
    // 小节标题形如「## 上标/下标（sup/sub）」，括号里可能用 / 并列多个指令
    for (const m of s.matchAll(/^#{2,3} .*?[（(]([a-z/-]+)[）)]/gm)) {
        for (const d of m[1].split('/')) {
            if (all.has(d)) names.add(d);
        }
    }
    perDoc[f.replace(/\.md$/, '')] = names;
}

console.log(`代码全集 ${all.size} 个（容器 ${container.size}，行内 ${inline.size}，图片 ${image.size}）\n`);
console.log('各分类文档实际覆盖：');
let mismatch = 0;
for (const [name, set] of Object.entries(perDoc)) {
    const s = read(path.join(DOCS, `${name}.md`));
    const claimed = s.match(/^title:.*?（(\d+)个指令）/m)?.[1];
    const flag = claimed && Number(claimed) !== set.size ? `  ← 标称 ${claimed}，不符` : '';
    if (flag) mismatch++;
    console.log(`  ${name.padEnd(12)} ${String(set.size).padStart(2)} 个${flag}`);
}

const covered = new Set(Object.values(perDoc).flatMap((s) => [...s]));
const missing = [...all].filter((d) => !covered.has(d)).sort();
if (missing.length) console.log(`\n未被任何小节标题覆盖: ${missing.join(', ')}`);
if (mismatch) {
    console.log(`\n${mismatch} 处标称数量与实际不符，请更新文档标题。`);
    process.exit(1);
}

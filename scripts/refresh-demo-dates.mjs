#!/usr/bin/env node
/**
 * 把演示文章的发布日期挪到最近八周内。
 *
 * 右侧栏热力图只统计最近 8 周。演示文章的日期是写死在 frontmatter 里的，
 * 时间一长就全部掉出窗口，用户克隆下来看到的是一片空白的格子——
 * 等于这个功能在演示站上不存在。
 *
 * 这个脚本按下面的排期重新分配日期，让热力图始终有内容，
 * 并且刻意让某两天各有两篇，好把颜色深浅的分级也展示出来。
 *
 * 发版前跑一次即可。加 --dry 只看不改。
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const DRY = process.argv.includes('--dry');
const BLOG = path.join(process.cwd(), 'src/content/blog');

/**
 * 距今天多少天。同一个数字出现两次，那天就有两篇，热力图会显示更深的颜色。
 *
 * 这里刻意不包含 backend-evolution-2024 和 frontend-trends-2025：
 * 它们的标题里写死了年份，挪日期会让标题和发布时间对不上。
 */
const SCHEDULE = {
    '01-choose-content-type': 53,
    '02-writing-with-directives': 52,
    '03-organize-with-series': 51,
    // 「内容指令示例」专栏按阅读顺序排，日期必须递增，专栏页才会正着排
    'directives-01-layout': 44,
    'directives-02-content': 42,
    'directives-03-media': 40,
    'directives-04-cards': 38,
    'directives-05-text': 36,
    'directives-06-charts': 34,
    'directives-07-math': 32,
    'directives-08-planning': 30,
    'directives-09-narrative': 28,
    'designing-typography-system': 23,
    'vergil-on-edgeone': 20,
    'plan-directive-guide': 9,
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');

/** 沿用文件原本的日期写法，不要顺手统一格式，免得 diff 里混进无关改动 */
function format(date, sample) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(sample)) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    return `${MONTHS[date.getMonth()]} ${pad(date.getDate())} ${date.getFullYear()}`;
}

const today = new Date();
today.setHours(12, 0, 0, 0);
let changed = 0;
let missing = 0;

for (const [slug, daysAgo] of Object.entries(SCHEDULE)) {
    const file = path.join(BLOG, `${slug}.md`);
    if (!fs.existsSync(file)) {
        console.log(`  跳过  ${slug}（文件不存在）`);
        missing++;
        continue;
    }
    const text = fs.readFileSync(file, 'utf-8');
    const match = text.match(/^publishDate:[ \t]*'?([^'\n]+)'?[ \t]*$/m);
    if (!match) {
        console.log(`  跳过  ${slug}（没有 publishDate）`);
        missing++;
        continue;
    }
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const next = format(date, match[1].trim());
    if (next === match[1].trim()) continue;

    if (!DRY) {
        fs.writeFileSync(file, text.replace(match[0], `publishDate: '${next}'`), 'utf-8');
    }
    console.log(`  ${match[1].trim().padEnd(12)} → ${next.padEnd(12)} ${slug}`);
    changed++;
}

console.log(`\n${DRY ? '预演：' : ''}${changed} 篇改了日期${missing ? `，${missing} 篇跳过` : ''}。`);
if (DRY) console.log('（没有真的写入，去掉 --dry 才会生效）');

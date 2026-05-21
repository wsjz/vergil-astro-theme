export const fontsRegistry: Record<string, { cssName: string; family: string; path?: string; cdn?: string; format?: string }> = {
    inter: {
        cssName: 'Inter Variable',
        family: 'sans-serif',
    },
    lxgwwenkai: {
        cssName: 'LXGW WenKai',
        family: 'sans-serif',
        path: '/fonts/LXGWWenKai-Regular.woff2',
        format: 'woff2',
    },
    maokenZhuyuanTi: {
        cssName: 'MaokenZhuyuanTi',
        family: 'sans-serif',
        path: '/fonts/maoken-zhuyuan-ti.woff2',
        format: 'woff2',
    },
    monoFonts: {
        cssName: 'ui-monospace',
        family: "ui-monospace, 'Cascadia Code', 'JetBrains Mono', Menlo, Monaco, Consolas, monospace",
    },
};

export const fonts = {
    display: 'maokenZhuyuanTi' as const,
    body: 'lxgwwenkai' as const,
    ui: 'maokenZhuyuanTi' as const,
    mono: 'monoFonts' as const,
};

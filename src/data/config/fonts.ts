export const fontsRegistry: Record<string, { cssName: string; family: string; path?: string; cdn?: string; format?: string }> = {
    inter: {
        cssName: 'Inter Variable',
        family: 'sans-serif',
    },
    lxgwwenkai: {
        cssName: 'LXGW WenKai',
        family: 'sans-serif',
        path: '/fonts/LXGWWenKai-Regular.ttf',
        format: 'truetype',
    },
    maokenZhuyuanTi: {
        cssName: 'MaokenZhuyuanTi',
        family: 'sans-serif',
        path: '/fonts/maoken-zhuyuan-ti.ttf',
        format: 'truetype',
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

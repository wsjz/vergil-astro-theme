import siteConfig, { fontsRegistry } from '../data/site-config';

type FontDef = { cssName: string; family: string; path?: string; cdn?: string; format?: string };
type FileFont = FontDef & { path: string };
type CdnFont = FontDef & { cdn: string };

export type FontKey = keyof typeof fontsRegistry;

function isCdnFont(font: FontDef): font is CdnFont {
    return typeof font.cdn === 'string' && font.cdn.length > 0;
}

function isFileFont(font: FontDef): font is FileFont {
    return typeof font.path === 'string' && font.path.length > 0;
}

export function getFontCssValue(key: FontKey): string {
    const font = fontsRegistry[key];
    return `'${font.cssName}', ${font.family}`;
}

function collectFonts(keys: FontKey[]) {
    const usedKeys = [...new Set(keys)];
    const cdnFonts: CdnFont[] = [];
    const fileFonts: FileFont[] = [];

    for (const k of usedKeys) {
        const font = fontsRegistry[k] as FontDef;
        if (isFileFont(font)) {
            fileFonts.push(font);
        } else if (isCdnFont(font)) {
            cdnFonts.push(font);
        }
    }

    return { cdnFonts, fileFonts };
}

export function getSiteFonts(): {
    display: string;
    body: string;
    ui: string;
    mono: string;
    cdnFonts: CdnFont[];
    fileFonts: FileFont[];
} {
    const display = siteConfig.fonts.display as FontKey;
    const body = siteConfig.fonts.body as FontKey;
    const ui = siteConfig.fonts.ui as FontKey;
    const mono = siteConfig.fonts.mono as FontKey;
    const { cdnFonts, fileFonts } = collectFonts([display, body, ui, mono]);
    return {
        display: getFontCssValue(display),
        body: getFontCssValue(body),
        ui: getFontCssValue(ui),
        mono: getFontCssValue(mono),
        cdnFonts,
        fileFonts,
    };
}

export function resolveFontOverrides(
    overrides?: Partial<Record<'display' | 'body', string>>
): {
    display: string;
    body: string;
    ui: string;
    mono: string;
    cdnFonts: CdnFont[];
    fileFonts: FileFont[];
} {
    const display = (overrides?.display && overrides.display in fontsRegistry ? overrides.display : siteConfig.fonts.display) as FontKey;
    const body = (overrides?.body && overrides.body in fontsRegistry ? overrides.body : siteConfig.fonts.body) as FontKey;
    const ui = siteConfig.fonts.ui as FontKey;
    const mono = siteConfig.fonts.mono as FontKey;
    const { cdnFonts, fileFonts } = collectFonts([display, body, ui, mono]);
    return {
        display: getFontCssValue(display),
        body: getFontCssValue(body),
        ui: getFontCssValue(ui),
        mono: getFontCssValue(mono),
        cdnFonts,
        fileFonts,
    };
}

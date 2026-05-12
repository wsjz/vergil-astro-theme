/**
 * Album theme registry.
 *
 * To add a new theme:
 * 1. Create a new directory under themes/
 * 2. Implement index.astro entry component
 * 3. Import and register here
 */
import GoldenTheme from './golden/index.astro';
import SeasonsTheme from './seasons/index.astro';

/** Theme component mapping */
export const ALBUM_THEMES = {
    golden: GoldenTheme,
    seasons: SeasonsTheme,
} as const;

/** Supported theme names */
export type AlbumThemeName = keyof typeof ALBUM_THEMES;

/** Default theme */
export const DEFAULT_ALBUM_THEME: AlbumThemeName = 'golden';

/** Check if a theme name is registered */
export function isValidAlbumTheme(theme: string): theme is AlbumThemeName {
    return theme in ALBUM_THEMES;
}

/** Get theme component with fallback to default */
export function getAlbumTheme(theme: string) {
    return isValidAlbumTheme(theme) ? ALBUM_THEMES[theme] : ALBUM_THEMES[DEFAULT_ALBUM_THEME];
}

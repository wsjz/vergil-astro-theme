export function slugify(input?: string) {
    if (!input) return '';

    let slug = input.toLowerCase().trim();
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Keep Chinese/Japanese/Korean characters, alphanumeric, spaces and hyphens
    slug = slug.replace(/[^\u4e00-\u9fa5\u3040-\u30ffa-z0-9\s-]/g, ' ').trim();
    slug = slug.replace(/[\s-]+/g, '-');

    return slug || input.trim();
}

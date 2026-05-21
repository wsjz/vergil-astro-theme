export const splash = {
    enabled: true,
    backgroundImage: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80'
    ],
    overlay: 'rgba(0,0,0,0.1)',
    textShadow: true,
    fallbackBg: 'bg-black',
    gradientColor: '#2d2d2d',
    gradientHeight: 'h-56',
    backdropBlur: '12px',
    slideDuration: 12,
    title: 'Vergil',
    description: 'Astro Framework for Content Creators',
    nav: [
        { text: '博客', href: '/blog', icon: 'book-open' },
        { text: '文档', href: '/docs/vergil-guide/', icon: 'file-text' },
        { text: 'GitHub', href: 'https://github.com/wsjz/vergil-astro-theme', icon: 'github' },
        { text: '关于', href: '/about', icon: 'user' }
    ]
};

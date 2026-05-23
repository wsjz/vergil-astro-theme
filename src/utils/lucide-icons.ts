import {
    Home, Database, Heart, MoreHorizontal, FolderOpen, BookOpen,
    FileText, Image, Lightbulb, MessageSquare, Clock, Github,
    Link, User, TrainFront, ChevronDown, ChevronRight, Search,
    Menu, X, Wrench, Archive, LayoutGrid, MessageCircle,
    Bookmark, BookText
} from '@lucide/astro';

export const lucideNavIcons: Record<string, any> = {
    // 导航图标（kebab-case key → PascalCase 组件）
    'home': Home,
    'database': Database,
    'heart': Heart,
    'more-horizontal': MoreHorizontal,
    'folder-open': FolderOpen,
    'book-open': BookOpen,
    'file-text': FileText,
    'image': Image,
    'lightbulb': Lightbulb,
    'message-square': MessageSquare,
    'clock': Clock,
    'github': Github,
    'link': Link,
    'user': User,
    'train': TrainFront,
    'wrench': Wrench,
    'archive': Archive,
    'layout-grid': LayoutGrid,
    'message-circle': MessageCircle,
    'bookmark': Bookmark,
    'book-text': BookText,
    // 内部固定图标
    'chevron-down': ChevronDown,
    'chevron-right': ChevronRight,
    'search': Search,
    'menu': Menu,
    'x': X,
};

/**
 * 目录滚动高亮。
 *
 * SidebarToc 和 FloatingToc 原本各写了一份一模一样的算法：取所有带 id 的标题，
 * 算出吸顶导航的高度作为判定线，找出最后一个越过判定线的标题，然后换高亮。
 * 两边只有选择器和高亮类名不同，所以把算法抽到这里，差异用回调传进来。
 */

/** 吸顶导航 + 工具栏的总高度，作为「标题已滚过」的判定线 */
export function getScrollOffset() {
    const header = document.getElementById('top-nav-header');
    const toolbar = document.getElementById('floating-toolbar');
    return (header ? header.offsetHeight : 56) + (toolbar ? toolbar.offsetHeight : 0) + 16;
}

/**
 * @param {object} options
 * @param {() => NodeListOf<Element>|Element[]} options.getHeadings 取标题集合
 * @param {(id: string) => Element|null} options.resolveLink       由标题 id 找到对应的目录项
 * @param {(link: Element) => void} options.activate               给目录项加高亮
 * @param {() => void} options.deactivateAll                       清掉所有高亮
 * @param {() => boolean} [options.shouldSkip]                     返回 true 时跳过这一帧
 * @param {string} options.handlerKey                              挂在 window 上的句柄名，用于换页时解绑
 * @returns {() => void} 立即执行一次并返回 update 函数
 */
export function createScrollSpy({ getHeadings, resolveLink, activate, deactivateAll, shouldSkip, handlerKey }) {
    let lastActiveId = null;

    function update() {
        if (shouldSkip && shouldSkip()) return;

        const offset = getScrollOffset();
        let activeHeading = null;
        getHeadings().forEach((heading) => {
            if (heading.getBoundingClientRect().top <= offset) {
                activeHeading = heading;
            }
        });
        if (!activeHeading) return;

        const id = activeHeading.getAttribute('id');
        if (!id || id === lastActiveId) return;
        lastActiveId = id;

        const link = resolveLink(id);
        if (!link) return;

        deactivateAll();
        activate(link);
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            update();
            ticking = false;
        });
    }

    // ViewTransitions 换页后组件会重新初始化，先把上一次的监听解掉
    if (handlerKey && window[handlerKey]) {
        window.removeEventListener('scroll', window[handlerKey]);
    }
    if (handlerKey) window[handlerKey] = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });

    update();
    return update;
}

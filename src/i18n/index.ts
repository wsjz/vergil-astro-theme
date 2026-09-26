import { siteInfo } from '../data/config/identity';
import zhCN from './zh-CN';
import en from './en';

const dictionaries = { 'zh-CN': zhCN, en } as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof zhCN;

export const defaultLocale: Locale = 'zh-CN';

function isLocale(value: string): value is Locale {
    return value in dictionaries;
}

/** 配置里选的语言；配了字典里没有的值就退回默认，不让站点挂掉 */
export const locale: Locale = isLocale(siteInfo.locale) ? siteInfo.locale : defaultLocale;

/**
 * 当前语言的界面文案。直接按对象取值，有完整类型提示：
 *   t.nav.prev            -> '上一篇'
 *   t.nav.fromSeries('x') -> '来自专栏「x」'
 *
 * 构建期就确定，没有运行时开销。
 */
export const t: Dictionary = dictionaries[locale];

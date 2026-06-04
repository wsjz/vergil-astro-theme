// Umami Cloud API v1 Client
// Docs: https://umami.is/docs/cloud/api

export type TimeRange = 'today' | '7d' | '30d' | 'year';

export type UmamiStatValue = { value: number; prev: number } | number;

export interface UmamiStats {
    pageviews: UmamiStatValue;
    visitors: UmamiStatValue;
    visits: UmamiStatValue;
    bounces: UmamiStatValue;
    totaltime: UmamiStatValue;
}

export interface UmamiPageviews {
    pageviews: Array<{ x: string; y: number }>;
    sessions: Array<{ x: string; y: number }>;
}

export interface UmamiMetric {
    x: string;
    y: number;
}

export interface UmamiActive {
    x: number;
}

function getRangeTimestamps(range: TimeRange): { startAt: number; endAt: number } {
    const endAt = Date.now();
    const now = new Date();
    let startAt: number;

    switch (range) {
        case 'today':
            startAt = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            break;
        case '7d':
            startAt = endAt - 7 * 24 * 60 * 60 * 1000;
            break;
        case '30d':
            startAt = endAt - 30 * 24 * 60 * 60 * 1000;
            break;
        case 'year':
            startAt = new Date(now.getFullYear(), 0, 1).getTime();
            break;
        default:
            startAt = endAt - 7 * 24 * 60 * 60 * 1000;
    }

    return { startAt, endAt };
}

function buildUrl(base: string, path: string, params: Record<string, string>): string {
    const baseUrl = base.replace(/\/$/, '');
    const urlPath = path.startsWith('/') ? path : '/' + path;
    const url = new URL(baseUrl + urlPath);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    });
    return url.toString();
}

class UmamiClient {
    private apiHost: string;
    private apiToken: string;
    private websiteId: string;

    constructor(apiHost: string, apiToken: string, websiteId: string) {
        this.apiHost = apiHost.replace(/\/$/, '');
        this.apiToken = apiToken;
        this.websiteId = websiteId;
    }

    private async fetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
        const url = buildUrl(this.apiHost, path, params);
        const res = await fetch(url, {
            headers: {
                'x-umami-api-key': this.apiToken,
                Accept: 'application/json',
            },
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Umami API ${res.status}: ${text}`);
        }

        return res.json() as Promise<T>;
    }

    async getStats(range: TimeRange): Promise<UmamiStats> {
        const { startAt, endAt } = getRangeTimestamps(range);
        return this.fetch<UmamiStats>(`/websites/${this.websiteId}/stats`, {
            startAt: String(startAt),
            endAt: String(endAt),
        });
    }

    async getPageviews(range: TimeRange): Promise<UmamiPageviews> {
        const { startAt, endAt } = getRangeTimestamps(range);
        return this.fetch<UmamiPageviews>(`/websites/${this.websiteId}/pageviews`, {
            startAt: String(startAt),
            endAt: String(endAt),
            unit: 'day',
        });
    }

    async getMetrics(type: string, range: TimeRange): Promise<UmamiMetric[]> {
        const { startAt, endAt } = getRangeTimestamps(range);
        return this.fetch<UmamiMetric[]>(`/websites/${this.websiteId}/metrics`, {
            type,
            startAt: String(startAt),
            endAt: String(endAt),
        });
    }

    async getActive(): Promise<UmamiActive> {
        return this.fetch<UmamiActive>(`/websites/${this.websiteId}/active`);
    }
}

export { UmamiClient, getRangeTimestamps };

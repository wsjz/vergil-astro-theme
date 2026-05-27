/**
 * ECharts on-demand core module.
 *
 * Only registers commonly used chart types and components to reduce bundle size
 * by ~75% compared to the full echarts import.
 *
 * Registered: line, bar, pie, scatter, radar + grid, title, tooltip, legend, toolbox, dataZoom, visualMap
 */
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart, ScatterChart, RadarChart } from 'echarts/charts';
import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
} from 'echarts/components';

// Register only what we need
const used = [
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    ScatterChart,
    RadarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
];

// Defensive: avoid double-register if hot-reloaded in dev
if (typeof echarts.use === 'function') {
    echarts.use(used);
}

// Register dark theme for dark mode support
const DARK_PALETTE = [
    '#4992ff', '#7cffb2', '#fddd60', '#ff6e76',
    '#58d9f9', '#05c091', '#ff8a45', '#8d48e3',
    '#dd79ff', '#5470c6', '#91cc75', '#fac858',
    '#ee6666', '#73c0de', '#3ba272', '#fc8452',
    '#9a60b4', '#ea7ccc',
];

const AXIS_COMMON_DARK = {
    axisLine: { lineStyle: { color: '#555' } },
    axisTick: { lineStyle: { color: '#555' } },
    axisLabel: { color: '#aaa' },
    splitLine: { lineStyle: { color: '#333' } },
    splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } },
};

const DARK_THEME = {
    color: DARK_PALETTE,
    backgroundColor: 'transparent',
    textStyle: { color: '#d1d5db' },
    title: {
        textStyle: { color: '#f3f4f6' },
        subtextStyle: { color: '#9ca3af' },
    },
    line: { lineStyle: { width: 2 } },
    radar: {
        axisName: { color: '#d1d5db' },
        splitLine: { lineStyle: { color: '#444' } },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } },
        axisLine: { lineStyle: { color: '#444' } },
    },
    bar: { itemStyle: { borderRadius: [2, 2, 0, 0] } },
    pie: {
        label: { color: '#d1d5db' },
        labelLine: { lineStyle: { color: '#666' } },
    },
    categoryAxis: AXIS_COMMON_DARK,
    valueAxis: AXIS_COMMON_DARK,
    logAxis: AXIS_COMMON_DARK,
    timeAxis: AXIS_COMMON_DARK,
    legend: {
        textStyle: { color: '#d1d5db' },
        pageTextStyle: { color: '#d1d5db' },
    },
    tooltip: {
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        textStyle: { color: '#f3f4f6' },
        axisPointer: {
            lineStyle: { color: '#666' },
            crossStyle: { color: '#666' },
            label: { backgroundColor: '#374151', color: '#f3f4f6' },
        },
    },
    dataZoom: {
        textStyle: { color: '#d1d5db' },
        handleStyle: { color: '#666' },
        borderColor: '#444',
        fillerColor: 'rgba(255,255,255,0.1)',
        dataBackground: {
            lineStyle: { color: '#555' },
            areaStyle: { color: 'rgba(255,255,255,0.05)' },
        },
        selectedDataBackground: {
            lineStyle: { color: '#4992ff' },
            areaStyle: { color: 'rgba(73,146,255,0.15)' },
        },
    },
    toolbox: {
        iconStyle: { borderColor: '#aaa' },
        emphasis: { iconStyle: { borderColor: '#fff' } },
    },
    visualMap: {
        textStyle: { color: '#d1d5db' },
        inRange: { color: ['#1a237e', '#0d47a1', '#1976d2', '#42a5f5', '#90caf9', '#e3f2fd'] },
    },
};

if (typeof echarts.registerTheme === 'function') {
    echarts.registerTheme('vergil-dark', DARK_THEME);
}

export default echarts;

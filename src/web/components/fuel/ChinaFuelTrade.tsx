import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../../hooks/useData';
import * as Prm from '../params';


interface TradeFlowData {
    year: number;
    imports_trln_USD: number;
    imports_mln_metric_tons: number;
    exports_trln_USD: number;
    exports_mln_metric_tons: number;
    balance_trln_USD: number;
    balance_mln_metric_tons: number;
    ratio_of_total_imports_usd: number;
    ratio_of_total_imports_weight: number;
}

export const ChinaFuelTrade: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { data: flowData, loading } = useData<TradeFlowData[]>('country_specific/CHN/fuel_trade.csv');

    useEffect(() => {
        if (!chartRef.current || !flowData) return;

        const chart = echarts.init(chartRef.current);
        const option = {
            title: {
                text: 'Mineral Fuel Deficit',
                left: 'center',
                top: 'top',
                textStyle: {
                    fontSize: Prm.plot_title_fontsz,
                    fontWeight: 'bold'
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow', // better for bar charts (you can use 'line' if preferred)
                    label: { backgroundColor: '#6a7985' }
                },
                formatter: (params: any[]) => {
                    // Use the first point’s x-axis label
                    const category = params[0].name;
                    let s = `<b>${category}</b><br/>`;
                    params.forEach(p => {
                        s += `${p.marker}${p.seriesName}: ${p.value}<br/>`;
                    });
                    return s;
                }
            },
            grid: {
                show: false,
                left: '10%',
                right: '10%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: flowData.map((d) => d.year),
                splitLine: { show: false },
                axisLabel: {
                    fontSize: Prm.label_fontsz,
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Fuel Deficit (Mil. Tons)',
                    nameLocation: 'middle',
                    nameGap: 50,
                    min: 0,
                    splitLine: { show: false },
                    nameTextStyle: {
                        fontSize: Prm.title_fontsz,   // ← set your desired font size here
                        fontWeight: 'bold',      // optional
                    },
                    axisLabel: {
                        fontSize: Prm.label_fontsz,
                    }
                },
                {
                    type: 'value',
                    name: 'Ratio of Global Imports (%)',
                    nameLocation: 'middle',
                    nameGap: 50,
                    nameRotate: -90,
                    position: 'right',
                    min: 0,
                    splitLine: { show: false },
                    alignTicks: true,
                    nameTextStyle: {
                        fontSize: Prm.title_fontsz,   // ← set your desired font size here
                        fontWeight: 'bold',      // optional
                    },
                    axisLabel: {
                        fontSize: Prm.label_fontsz,
                    }
                },
            ],
            series: [
                {
                    name: 'Fuel Trade Balance',
                    type: 'bar',
                    data: flowData.map(d => Math.round(Math.abs(d.balance_mln_metric_tons) * 10) / 10),
                    itemStyle: {
                        color: Prm.curve_color_china_red
                    }
                },
                {
                    name: 'Ratio of Global Imports',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: flowData.map(d => Math.round(d.ratio_of_total_imports_weight * 1000) / 10),
                    lineStyle: {
                        color: Prm.curve_color_china_yellow,
                        width: Prm.line_width
                    },
                    itemStyle: {
                        color: Prm.curve_color_china_yellow
                    },
                    symbol: Prm.marker_shape,
                    symbolSize: 0,
                }
            ]
        };

        chart.setOption(option);

    }, [flowData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

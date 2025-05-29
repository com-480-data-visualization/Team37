import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../../hooks/useData';
import * as Prm from '../params';


// USDA Foreign Agricultural Service
// Wheat: 3.57 Mt imported / 4.54 Mt consumed → 79 % 
// Barley (feed): 3.0 Mt imported / 3.0 Mt consumed → ≈ 100 % 
// Corn (feed & food): 4.0 Mt imported / 4.85 Mt consumed → 82 % 
// Rice (food): 1.56 Mt imported / 1.56 Mt consumed → 100 % 

interface TradeFlowData {
  year: number;
  imports_mln_metric_tons: number;
  exports_mln_metric_tons: number;
}

export const SaudiGrainTrade: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ year: string; value: number } | null>(null);
  const { data: flowData, loading } = useData<TradeFlowData[]>('country_specific/SAU/cereals.csv');

  useEffect(() => {
    if (!chartRef.current || !flowData) return;

    const chart = echarts.init(chartRef.current);
    const option = {
      title: {
        text: 'Saudi Arabia Cereal Imports',
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
          type: 'shadow',
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
      xAxis: {
        type: 'category',
        data: flowData.map((d) => d.year),
        axisLabel: {
          fontSize: Prm.label_fontsz,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Million Metric Tons',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontSize: Prm.title_fontsz,
          fontWeight: 'bold',
        },
        axisLabel: {
          fontSize: Prm.label_fontsz,
        }
      },
      series: [
        {
          name: 'Cereal Imports',
          type: 'bar',
          data: flowData.map((d) => Math.round(d.imports_mln_metric_tons * 10) / 10),
          smooth: true,
          itemStyle: {
            color: Prm.curve_color_saudi_green,   // line color
          },
        },
        // {
        //   name: 'Exports',
        //   type: 'line',
        //   data: flowData.map((d) => d.exports_mln_metric_tons),
        //   smooth: true
        // }
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

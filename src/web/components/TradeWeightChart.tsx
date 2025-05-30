import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';
import * as Prm from './params';

interface TradeWeightData {
  year: string;
  quantity_mln_metric_tons: number;
}

export const TradeWeightChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: tradeData, loading } = useData<TradeWeightData[]>('goods_trade_tonnage.csv');

  useEffect(() => {
    if (!chartRef.current || !tradeData) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      backgroundColor: '#fff',
      title: {
        // text: 'Global Goods Trade by Weight',
        // subtext: 'Unit: Million Metric Tons',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
        }
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
        left: '6%',
        right: '6%',
        bottom: '5%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: tradeData.map(item => item.year),
        axisLabel: {
          formatter: '{value}',
          fontSize: 24
        }
      },
      yAxis: {
        type: 'value',
        position: 'right',
        name: 'Weight (Metric Tons)',
        nameLocation: 'middle', // Position the title in the middle vertically
        nameGap: 80, // Adjust this value to control the distance from the axis labels
        nameTextStyle: {
          verticalAlign: 'middle', // Ensures vertical centering
          align: 'center', // Ensures horizontal centering relative to the axis line
          padding: [0, 0, 0, 0],
          rotate: 90,
          fontSize: 26
        },
        axisLabel: {
          formatter: '{value}B',
          fontSize: 24
        }
      },
      series: [
        {
          name: 'Trade Weight (Bln. Metric Tons)',
          type: 'bar',
          data: tradeData.map(item => item.quantity_mln_metric_tons),
          itemStyle: {
            color: Prm.curve_color_blue
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, // Defines a vertical gradient (from top y=0 to bottom y=1)
              [
                {
                  offset: 0, // Start of the gradient (at the line)
                  color: 'rgba(128, 128, 128, 1.0)'
                },
                {
                  offset: 1, // End of the gradient (at the bottom)
                  color: 'rgba(128, 128, 128, 0)'
                }
              ]
            )
          }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [tradeData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: '95%',
        height: '600px',
        backgroundColor: '#fff',
        borderRadius: '98%',
        marginTop: '1%'
      }}
    />
  );
}; 
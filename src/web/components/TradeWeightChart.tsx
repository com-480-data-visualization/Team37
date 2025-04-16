import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

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
        text: 'Global Goods Trade by Weight',
        subtext: 'Unit: Million Metric Tons',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const value = params[0].value;
          const gizaPyramid = value / 5.9; // The Pyramids of Giza weigh about 5.9 million tons.
          const cars = value / 1.4; // Total global vehicle weight of about 140 million tons
          return `Year ${params[0].axisValue}<br/>
            Total Weight: ${value.toFixed(0)}M metric tons<br/>
            Equivalent to: ${gizaPyramid.toFixed(0)}x Pyramid of Giza<br/>
            Or ${cars.toFixed(0)}x all active cars in the world`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: tradeData.map(item => item.year),
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Weight (Million Metric Tons)',
        axisLabel: {
          formatter: '{value}M'
        }
      },
      series: [
        {
          name: 'Trade Weight',
          type: 'line',
          data: tradeData.map(item => item.quantity_mln_metric_tons),
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.3
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
        width: '100%', 
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }} 
    />
  );
}; 
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

interface TradeGDPData {
  year: string;
  trade_pcn_gdp: number;
}

export const TradeGDPChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: tradeData, loading } = useData<TradeGDPData[]>('goods_trade_as_pcnt_gdp.csv');

  useEffect(() => {
    if (!chartRef.current || !tradeData) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      backgroundColor: '#fff',
      title: {
        text: 'Global Goods Trade as Percentage of GDP',
        subtext: 'Unit: %',
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
          return `Year ${params[0].axisValue}<br/>Trade as % of GDP: ${params[0].value.toFixed(2)}%`;
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
        name: 'Percentage of GDP (%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: 'Trade as % of GDP',
          type: 'line',
          data: tradeData.map(item => item.trade_pcn_gdp),
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
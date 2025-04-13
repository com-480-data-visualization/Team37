import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

// Import world map data
import worldJson from '../assets/world.json';

interface TradeData {
  year: string;
  country: string;
  value_trln_USD: number;
  quantity_mln_metric_tons: number;
}

export const WorldTradeMap: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: tradeData, loading } = useData<TradeData[]>('absolute_deficit_2023.csv');

  useEffect(() => {
    if (!chartRef.current || !tradeData) return;

    const chart = echarts.init(chartRef.current);
    
    // Register world map
    echarts.registerMap('world', worldJson as any);
    
    const option = {
      backgroundColor: '#fff',
      title: {
        text: 'Global Trade Balance Distribution 2023',
        subtext: 'Unit: Trillion USD',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const value = params.value || 0;
          return `${params.name}<br/>Trade ${value >= 0 ? 'Surplus' : 'Deficit'}: ${value.toFixed(3)} Trillion USD`;
        }
      },
      visualMap: {
        left: 'left',
        min: -0.05,
        max: 0.05,
        text: ['Surplus', 'Deficit'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#c23531', '#ffffff', '#2f4554']
        }
      },
      series: [
        {
          name: 'Trade Balance',
          type: 'map',
          map: 'world',
          roam: true,
          emphasis: {
            label: {
              show: true
            }
          },
          data: tradeData.map(item => ({
            name: item.country,
            value: item.value_trln_USD
          }))
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
        height: '600px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }} 
    />
  );
}; 
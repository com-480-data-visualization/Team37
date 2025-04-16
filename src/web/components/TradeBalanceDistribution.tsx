import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

interface TradeBalanceData {
  year: string;
  [key: string]: string | number;
}

export const TradeBalanceDistribution: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: surplusData, loading: surplusLoading } = useData<TradeBalanceData[]>('top_surplus_countries_pcnt.csv');
  const { data: deficitData, loading: deficitLoading } = useData<TradeBalanceData[]>('top_deficit_countries_pcnt.csv');

  useEffect(() => {
    if (!chartRef.current || !surplusData || !deficitData) return;

    const chart = echarts.init(chartRef.current);

    
    const surplus2023 = surplusData.find((row: any) => row.year === 2023 || row.year === "2023");
    const deficit2023 = deficitData.find((row: any) => row.year === 2023 || row.year === "2023");

  
    const surplusArr = surplus2023
      ? Object.entries(surplus2023)
          .filter(([key]) => key !== "year")
          .map(([country, value]) => ({ name: country, value: Number(value) }))
      : [];

    const deficitArr = deficit2023
      ? Object.entries(deficit2023)
          .filter(([key]) => key !== "year")
          .map(([country, value]) => ({ name: country, value: Number(value) }))
      : [];

    const option = {
      backgroundColor: '#fff',
      title: {
        text: 'Distribution of Global Trade Surplus/Deficit',
        subtext: 'Top 5 Countries (2023)',
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
          return `${params.name}<br/>Share of Global ${params.seriesName}: ${params.value.toFixed(1)}%`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Surplus', 'Deficit']
      },
      series: [
        {
          name: 'Surplus',
          type: 'pie',
          radius: ['0%', '50%'],
          center: ['25%', '50%'],
          data: surplusArr,
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: 'Deficit',
          type: 'pie',
          radius: ['0%', '50%'],
          center: ['75%', '50%'],
          data: deficitArr,
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
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
  }, [surplusData, deficitData]);

  if (surplusLoading || deficitLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }} 
    />
  );
}; 
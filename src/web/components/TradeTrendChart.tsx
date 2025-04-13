import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

interface TrendData {
  year: string;
  CHN: number;
  DEU: number;
  RUS: number;
  S19: number;
  KOR: number;
}

export const TradeTrendChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: trendData, loading } = useData<any>('top_surplus_countries_pcnt.csv');

  useEffect(() => {
    if (!chartRef.current || !trendData) return;

    const chart = echarts.init(chartRef.current);
    
    // Process data
    const processedData = trendData.map((row: any) => ({
      year: row.year,
      CHN: parseFloat(row.CHN),
      DEU: parseFloat(row.DEU),
      RUS: parseFloat(row.RUS),
      S19: parseFloat(row.S19),
      KOR: parseFloat(row.KOR)
    }));

    const years = processedData.map((item: TrendData) => item.year);
    
    const option = {
      backgroundColor: '#fff',
      title: {
        text: 'Trade Surplus as Percentage of GDP by Major Countries',
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
          let result = `Year ${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: ${param.value.toFixed(2)}%<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['China', 'Germany', 'Russia', 'S19', 'South Korea'],
        top: 60
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {},
          dataZoom: {},
          restore: {}
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: years,
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
          name: 'China',
          type: 'line',
          data: processedData.map((item: TrendData) => item.CHN),
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 2
          }
        },
        {
          name: 'Germany',
          type: 'line',
          data: processedData.map((item: TrendData) => item.DEU),
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 2
          }
        },
        {
          name: 'Russia',
          type: 'line',
          data: processedData.map((item: TrendData) => item.RUS),
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 2
          }
        },
        {
          name: 'S19',
          type: 'line',
          data: processedData.map((item: TrendData) => item.S19),
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 2
          }
        },
        {
          name: 'South Korea',
          type: 'line',
          data: processedData.map((item: TrendData) => item.KOR),
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          lineStyle: {
            width: 2
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
  }, [trendData]);

  if (loading) {
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
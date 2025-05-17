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
        formatter: function(params: any) {
          const value = params[0].value;
          const gizaPyramid = value / 5.9; // The Pyramids of Giza weigh about 5.9 million tons.
          const cars = value / 1.4; // Total global vehicle weight of about 140 million tons
          return `Year ${params[0].axisValue}<br/>
            Total Weight: ${value.toFixed(0)}M metric tons<br/>`;
            // Equivalent to: ${gizaPyramid.toFixed(0)}x Pyramid of Giza<br/>
            // Or ${cars.toFixed(0)}x all active cars in the world`;
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
        boundaryGap: false,
        data: tradeData.map(item => item.year),
        axisLabel: {
          formatter: '{value}',
          fontSize: 16
        }
      },
      yAxis: {
        type: 'value',
        position: 'right',
        name: 'Weight (Metric Tons)',
        nameLocation: 'middle', // Position the title in the middle vertically
        nameGap: 55, // Adjust this value to control the distance from the axis labels
        nameTextStyle: {
          verticalAlign: 'middle', // Ensures vertical centering
          align: 'center', // Ensures horizontal centering relative to the axis line
          padding: [0, 0, 0, 0],
          rotate: 90,
          fontSize: 18
        },
        axisLabel: {
          formatter: '{value}B',
          fontSize: 16
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
            width: 10,
            color: '#808080'
          },
          itemStyle: {
            color: '#808080'
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
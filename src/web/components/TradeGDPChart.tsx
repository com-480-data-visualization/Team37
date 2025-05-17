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
        // text: 'Global Goods Trade as Percentage of GDP',
        // subtext: 'Unit: %',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          return `Year ${params[0].axisValue}<br/>Trade as % of GDP: ${params[0].value.toFixed(2)}%`;
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
        name: 'Percent of GDP',
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
          formatter: '{value}%',
          fontSize: 16
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
            width: 10,
            color: '#85BB65'
          },
          itemStyle: {
            color: '#85BB65'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1, // Defines a vertical gradient (from top y=0 to bottom y=1)
              [
                {
                  offset: 0, // Start of the gradient (at the line)
                  color: 'rgba(133, 187, 101, 1.0)'
                },
                {
                  offset: 1, // End of the gradient (at the bottom)
                  color: 'rgba(133, 187, 101, 0)'
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
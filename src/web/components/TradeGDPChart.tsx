import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

interface TradeGDPData {
  year: string;
  trade_pcn_gdp: number;
}

const eventData = {
  "1995": {
    title: "WTO Established",
    description: "World Trade Organization officially begins operation on January 1, 1995.",
    imageUrl: "./assets/wto.png"
  },
  "2001": {
    title: "China joined WTO",
    description: "Jesus Christ pls save me from this huge trade deficit.",
    imageUrl: "./assets/wto-china.jpg"
  },
  "2008": {
    title: "Global Financial Crisis",
    description: "Trade volumes dropped sharply during the financial crisis.",
    imageUrl: "./assets/2008-mortgage.webp"
  },
  "2016": {
    title: "MAKE AMERICA GREAT AGAIN!!!!!!!!!!!!!!!",
    description: "CHINA!!!!!!!!!!!!!!!!!!!!!",
    imageUrl: "./assets/trump_mad.webp"
  },
  "2020": {
    title: "COVID-19 Pandemic",
    description: "Global trade was significantly disrupted by pandemic lockdowns.",
    imageUrl: "./assets/corona.jpg"
  }
};

export const TradeGDPChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<{year: string, value: number} | null>(null);
  const { data: tradeData, loading } = useData<TradeGDPData[]>('goods_trade_as_pcnt_gdp.csv');

  useEffect(() => {
    if (!chartRef.current || !tradeData) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      backgroundColor: '#fff',
      title: {
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
          const year = params[0].axisValue;
          const event = eventData[year];
          if (event) {
            return `
              <div style="font-weight:bold;margin-bottom:5px;text-align:center">${event.title} (${year})</div>
              <div style="text-align:center;margin-bottom:5px">${event.description}</div>
              <div style="display:flex;justify-content:center;margin:10px 0">
                <img src="${event.imageUrl}" style="max-width:100%;max-height:100px;border-radius:4px;display:block"/>
              </div>
              <div style="margin-top:5px;text-align:center">Trade: ${params[0].value.toFixed(2)}% of GDP</div>
            `;
          }
          return `Year ${year}<br/>Trade as % of GDP: ${params[0].value.toFixed(2)}%`;
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
        nameLocation: 'middle',
        nameGap: 55,
        nameTextStyle: {
          verticalAlign: 'middle',
          align: 'center',
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
          data: tradeData.map(item => ({
            value: item.trade_pcn_gdp,
            itemStyle: {
              color: eventData[item.year] ? '#FF6B6B' : '#85BB65'
            }
          })),
          smooth: true,
          symbol: 'circle',
          symbolSize: function (data: any) {
            return eventData[data[0]] ? 10 : 5;
          },
          lineStyle: {
            width: 10,
            color: '#85BB65'
          },
          itemStyle: {
            color: '#85BB65'
          },
          emphasis: {
            itemStyle: {
              color: '#FF6B6B',
              borderWidth: 2,
              borderColor: '#FFF'
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 0, 1,
              [
                { offset: 0, color: 'rgba(133, 187, 101, 1.0)' },
                { offset: 1, color: 'rgba(133, 187, 101, 0)' }
              ]
            )
          }
        }
      ]
    };

    chart.setOption(option);

    // Click event handler
    chart.on('click', (params: any) => {
      if (params.componentType === 'series') {
        const year = tradeData[params.dataIndex].year;
        const value = tradeData[params.dataIndex].trade_pcn_gdp;
        setSelectedPoint({ year, value });
      }
    });

    const handleResize = () => chart.resize();
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
    <div style={{ position: 'relative' }}>
      <div
        ref={chartRef}
        style={{
          width: '95%',
          height: '600px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          marginTop: '1%'
        }}
      />
      
      {/* Custom popup for clicked points */}
      {selectedPoint && eventData[selectedPoint.year] && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxWidth: '400px'
        }}>
          <button 
            onClick={() => setSelectedPoint(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <h3 style={{ marginTop: 0 }}>
            {eventData[selectedPoint.year].title} ({selectedPoint.year})
          </h3>
          <p>{eventData[selectedPoint.year].description}</p>
          <img 
            src={eventData[selectedPoint.year].imageUrl} 
            alt={eventData[selectedPoint.year].title}
            style={{ 
              width: '100%', 
              borderRadius: '4px',
              margin: '10px 0'
            }}
          />
          <p>Trade: {selectedPoint.value.toFixed(2)}% of GDP</p>
        </div>
      )}
    </div>
  );
};
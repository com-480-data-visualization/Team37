import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';
import { motion, useScroll, useTransform, WithQuerySelectorAll, animate, scroll } from 'framer-motion';
import * as Prm from './params';

interface TradeGDPData {
  year: string;
  trade_pcn_gdp: number;
}

const eventData = {
  "1995": {
    title: "WTO Established",
    description: "World Trade Organization officially begins operation on January 1, 1995.",
    imageUrl: "./assets/wto.png",
    newsUrl: "https://en.wikipedia.org/wiki/World_Trade_Organization"
  },
  "2001": {
    title: "China joined WTO",
    description: "This move fascilitated trade between China and the rest of the world by reducing tarrifs and etsblishing common rules and arbitration mechanisms.",
    imageUrl: "./assets/wto-china.jpg",
    newsUrl: "https://www.wto.org/english/thewto_e/acc_e/s7lu_e.pdf"
  },
  "2008": {
    title: "Global Financial Crisis",
    description: "Trade volumes dropped sharply during the financial crisis, even as a percentage of the also lower global GDP.",
    imageUrl: "./assets/2008-mortgage.webp",
    newsUrl: "https://en.wikipedia.org/wiki/2008_financial_crisis"
  },
  "2016": {
    title: "Shift in American Trade Policy",
    description: "Although free trade agreements had already started becoming unpopular with the electorate and toxic for candidates of both major US parties, the election of Donald Trump marked a shift in US trade policy that only became stronger by 2025.",
    imageUrl: "./assets/trump_mad.webp",
    newsUrl: "https://www.bbc.com/news/election-us-2016-37920175"
  },
  "2020": {
    title: "COVID-19 Pandemic",
    description: "Global trade was significantly disrupted by pandemic lockdowns. The concept of self-sufficiency for essential goods is strongly present in public discourse.",
    imageUrl: "./assets/corona.jpg",
    newsUrl: "https://www.who.int/news/item/29-06-2020-covidtimeline"
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
      title: {
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
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
          fontSize: 24
        }
      },
      yAxis: {
        type: 'value',
        position: 'right',
        name: 'Trade as % of Global GDP',
        nameLocation: 'middle',
        nameGap: 80,
        nameTextStyle: {
          verticalAlign: 'middle',
          align: 'center',
          padding: [0, 0, 0, 0],
          rotate: 90,
          fontSize: 26
        },
        axisLabel: {
          formatter: '{value}%',
          fontSize: 24
        }
      },
      series: [{
        name: 'Trade as % of GDP',
        type: 'line',
        data: tradeData.map(item => ({
          value: Math.round(item.trade_pcn_gdp * 10) / 10,
          itemStyle: {
            color: eventData[item.year] ? Prm.curve_color_red : Prm.curve_color_blue,
            borderColor: eventData[item.year] ? '#FFF' : 'transparent',
            borderWidth: eventData[item.year] ? 2 : 0,
            shadowColor: eventData[item.year] ? 'rgba(255,107,107,0.5)' : 'transparent',
            shadowBlur: eventData[item.year] ? 10 : 0
          },
          symbolSize: eventData[item.year] ? Prm.marker_size_large : 6,
          symbol: eventData[item.year] ? 'roundRect' : 'circle',
        })),
        smooth: true,
        lineStyle: {
                                color: Prm.curve_color_blue,   // line color
                                width: Prm.line_width_thk            // optional: line width
                            },
                            itemStyle: {
                                color: Prm.curve_color_blue    // marker (symbol) color
                            },
        emphasis: { // Hover effects
          scale: true,
          itemStyle: {
            color: '#FF6B6B',
            borderColor: '#FFF',
            borderWidth: 3,
            shadowColor: 'rgba(255,107,107,0.8)',
            shadowBlur: 15
          },
          symbolSize: function (data: any) {
            return eventData[data[0]] ? Prm.marker_size_large : 8;
          }
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
      {selectedPoint && eventData[selectedPoint.year] && (() => {
        return (
          <>
            {/* Overlay: click to close popup */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 999, // Lower than popup
                background: 'rgba(0,0,0,0)', // Fully transparent
              }}
              onClick={() => setSelectedPoint(null)}
            />
            {/* Popup */}
            <div style={{
              position: 'fixed', // Changed from 'absolute'
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)', // Center the popup
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxWidth: '350px', // Increased width for better content display
              // transition for 'left' is no longer needed
            }}>
              {/* Close button */}
              <button 
                onClick={() => setSelectedPoint(null)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px', // Made 'x' more visible
                  cursor: 'pointer',
                  lineHeight: '1',
                  padding: '0'
                }}
              >
                &times; {/* Added the '×' character */}
              </button>
              <h3 style={{ marginTop: 0, fontSize: '1.05rem', lineHeight: 1.2 }}>
                {eventData[selectedPoint.year].title} ({selectedPoint.year})
              </h3>
              <p style={{ fontSize: '0.92rem', margin: '8px 0' }}>{eventData[selectedPoint.year].description}</p>
              <a href={eventData[selectedPoint.year].newsUrl} target="_blank" rel="noopener noreferrer">
                <img 
                  src={eventData[selectedPoint.year].imageUrl} 
                  alt={eventData[selectedPoint.year].title}
                  style={{ 
                    width: '100%', 
                    borderRadius: '4px',
                    margin: '10px auto',
                    display: 'block'
                  }}
                />
              </a>
              <p style={{ fontSize: '0.92rem', margin: '8px 0' }}>Trade: {selectedPoint.value.toFixed(2)}% of GDP</p>
            </div>
          </>
        );
      })()}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';
import { motion, useScroll, useTransform, WithQuerySelectorAll, animate, scroll } from 'framer-motion';

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
    description: "Jesus Christ pls save me from this huge trade deficit.",
    imageUrl: "./assets/wto-china.jpg",
    newsUrl: "https://www.wto.org/english/thewto_e/acc_e/s7lu_e.pdf"
  },
  "2008": {
    title: "Global Financial Crisis",
    description: "Trade volumes dropped sharply during the financial crisis.",
    imageUrl: "./assets/2008-mortgage.webp",
    newsUrl: "https://en.wikipedia.org/wiki/2008_financial_crisis"
  },
  "2016": {
    title: "MAKE AMERICA GREAT AGAIN!!!!!!!!!!!!!!!",
    description: "CHINA!!!!!!!!!!!!!!!!!!!!!",
    imageUrl: "./assets/trump_mad.webp",
    newsUrl: "https://www.bbc.com/news/election-us-2016-37920175"
  },
  "2020": {
    title: "COVID-19 Pandemic",
    description: "Global trade was significantly disrupted by pandemic lockdowns.",
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
      title: {
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
        }
      },
      tooltip: {
        show: false
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
      series: [{
        name: 'Trade as % of GDP',
        type: 'line',
        data: tradeData.map(item => ({
          value: item.trade_pcn_gdp,
          itemStyle: {
            color: eventData[item.year] ? '#FF6B6B' : '#85BB65',
            borderColor: eventData[item.year] ? '#FFF' : 'transparent',
            borderWidth: eventData[item.year] ? 2 : 0,
            shadowColor: eventData[item.year] ? 'rgba(255,107,107,0.5)' : 'transparent',
            shadowBlur: eventData[item.year] ? 10 : 0
          },
          symbolSize: eventData[item.year] ? 14 : 6,
          symbol: eventData[item.year] ? 'roundRect' : 'circle',
        })),
        smooth: true,
        lineStyle: {
          width: 3, // Slightly thinner line
          color: '#85BB65'
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
            return eventData[data[0]] ? 18 : 8;
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
        // Calculate the left position and clamp it to avoid overflow
        const yearPercent = (parseInt(selectedPoint.year) - 1995) * (100 / (2023 - 1995));
        const safePercent = Math.max(10, Math.min(90, yearPercent));
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
          position: 'absolute',
          top: '50%',
              left: `${safePercent}%`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
              maxWidth: '200px',
              transition: 'left 0.3s ease-in-out'
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

const TradeGDPChartWithScroll = ({ tradeData }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [activeEventIndex, setActiveEventIndex] = useState(-1);
  const eventYears = Object.keys(eventData).sort();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  useEffect(() => {
    if (!chartRef.current || !tradeData || tradeData.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Full chart configuration
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
        show: false
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
      series: [{
        name: 'Trade as % of GDP',
        type: 'line',
        data: tradeData.map(item => ({
          value: item.trade_pcn_gdp,
          itemStyle: {
            color: eventData[item.year] ? '#FF6B6B' : '#85BB65',
            borderColor: eventData[item.year] ? '#FFF' : 'transparent',
            borderWidth: eventData[item.year] ? 2 : 0,
            shadowColor: eventData[item.year] ? 'rgba(255,107,107,0.5)' : 'transparent',
            shadowBlur: eventData[item.year] ? 10 : 0
          },
          symbolSize: eventData[item.year] ? 14 : 6,
          symbol: eventData[item.year] ? 'roundRect' : 'circle',
        })),
        smooth: true,
        lineStyle: {
          width: 3, // Slightly thinner line
          color: '#85BB65'
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
            return eventData[data[0]] ? 18 : 8;
          }
        }
      }
    ]
    };

    chart.setOption(option);

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const index = Math.min(
        Math.floor(progress * eventYears.length),
        eventYears.length - 1
      );
      setActiveEventIndex(index);
    });

    return () => {
      unsubscribe();
      chart.dispose();
    };
  }, [tradeData, scrollYProgress]);

  useEffect(() => {
    if (!chartRef.current || !tradeData || tradeData.length === 0) return;

    const chart = echarts.init(chartRef.current);

    // Initial chart configuration
    const option = {
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const year = params[0].axisValue;
          const value = params[0].value;
          return `Year: ${year}<br/>Trade: ${value.toFixed(2)}% of GDP`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: tradeData.map(item => item.year),
        axisLabel: { rotate: 45 }
      },
      yAxis: {
        type: 'value',
        name: '% of GDP',
        nameLocation: 'middle',
        nameGap: 30
      },
      series: [{
        name: 'Trade as % of GDP',
        type: 'line',
        data: tradeData.map(item => ({
          value: item.trade_pcn_gdp,
          itemStyle: {
            color: '#85BB65',
            opacity: 0.6
          },
          symbolSize: 6
        })),
        lineStyle: {
          width: 3,
          color: '#85BB65'
        },
        emphasis: {
          itemStyle: {
            color: '#FF6B6B',
            borderColor: '#FFF',
            borderWidth: 3,
            shadowColor: 'rgba(255,107,107,0.8)',
            shadowBlur: 15
          }
        }
      }]
    };

    chart.setOption(option);
  }, [activeEventIndex, tradeData, eventYears]);

  return (
    <div ref={containerRef} style={{ height: '200vh', position: 'relative' }}>
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div
          ref={chartRef}
          style={{ 
            width: '100%', 
            height: '80%',
            margin: '0 auto'
          }}
        />
        
        {activeEventIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              maxWidth: '500px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: '1.05rem', lineHeight: 1.2 }}>
              {eventData[eventYears[activeEventIndex]].title} ({eventYears[activeEventIndex]})
            </h3>
            <p style={{ fontSize: '0.92rem', margin: '8px 0' }}>{eventData[eventYears[activeEventIndex]].description}</p>
            <a href={eventData[eventYears[activeEventIndex]].newsUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={eventData[eventYears[activeEventIndex]].imageUrl} 
                alt={eventData[eventYears[activeEventIndex]].title}
              style={{ 
                  width: '100%', 
                borderRadius: '4px',
                margin: '10px auto',
                display: 'block'
              }} 
            />
            </a>
            <p style={{ fontSize: '0.92rem', margin: '8px 0' }}>
              <strong>Trade:</strong> {
                tradeData.find(d => d.year === eventYears[activeEventIndex])?.trade_pcn_gdp?.toFixed(2) ?? 'N/A'} % of GDP
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
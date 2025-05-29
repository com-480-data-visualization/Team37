import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../../hooks/useData';
import * as Prm from '../params';

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

// USDA Foreign Agricultural Service
// Wheat: 3.57 Mt imported / 4.54 Mt consumed → 79 % 
// Barley (feed): 3.0 Mt imported / 3.0 Mt consumed → ≈ 100 % 
// Corn (feed & food): 4.0 Mt imported / 4.85 Mt consumed → 82 % 
// Rice (food): 1.56 Mt imported / 1.56 Mt consumed → 100 % 

interface TradeFlowData {
  year: number;
  imports_mln_metric_tons: number;
  exports_mln_metric_tons: number;
}

export const SaudiGrainTrade: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ year: string; value: number } | null>(null);
  const { data: flowData, loading } = useData<TradeFlowData[]>('country_specific/SAU/cereals.csv');

  useEffect(() => {
    if (!chartRef.current || !flowData) return;

    const chart = echarts.init(chartRef.current);
    const option = {
      title: {
        text: 'Saudi Arabia Cereal Imports',
        left: 'center',
        top: 'top',
        textStyle: {
          fontSize: Prm.plot_title_fontsz,
          fontWeight: 'bold'
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
      xAxis: {
        type: 'category',
        data: flowData.map((d) => d.year),
        axisLabel: {
          fontSize: Prm.label_fontsz,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Million Metric Tons',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontSize: Prm.title_fontsz,
          fontWeight: 'bold',
        },
        axisLabel: {
          fontSize: Prm.label_fontsz,
        }
      },
      series: [
        {
          name: 'Cereal Imports',
          type: 'bar',
          data: flowData.map((d) => Math.round(d.imports_mln_metric_tons * 10) / 10),
          smooth: true,
          itemStyle: {
            color: Prm.curve_color_saudi_green,   // line color
          },
        },
        // {
        //   name: 'Exports',
        //   type: 'line',
        //   data: flowData.map((d) => d.exports_mln_metric_tons),
        //   smooth: true
        // }
      ]
    };

    chart.setOption(option);

  }, [flowData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const SankeyStaticTest: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const instance = echarts.init(chartRef.current);
    // 用户提供的真实数据
    const nodes = [
      {"name":"Other"},
      {"name":"CHN"},
      {"name":"MEX"},
      {"name":"JPN"},
      {"name":"S19"},
      {"name":"USA"},
      {"name":"CAN"},
      {"name":"DEU"}
    ];
    const links = [
      {"source":"Other","target":"USA","value":0.18645147},
      {"source":"CHN","target":"USA","value":0.08901083},
      {"source":"MEX","target":"USA","value":0.07868236},
      {"source":"JPN","target":"USA","value":0.03479433},
      {"source":"S19","target":"USA","value":0.03393553},
      {"source":"USA","target":"CAN","value":0.03893458},
      {"source":"USA","target":"DEU","value":0.01541835}
    ];
    const option = {
      title: { text: 'Sankey 用户真实数据测试', left: 'center', top: 10 },
      series: [{
        type: 'sankey',
        data: nodes,
        links: links,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5 },
        label: { fontSize: 14 },
        itemStyle: { color: '#3366cc', borderColor: '#333' }
      }]
    };
    instance.setOption(option);
    setTimeout(() => instance.resize(), 100);
    return () => { instance.dispose(); };
  }, []);
  return (
    <div style={{ border: '2px solid red', margin: 20 }}>
      <div style={{color: 'red'}}>SankeyStaticTest</div>
      <div ref={chartRef} style={{ width: 400, height: 300, background: '#fff' }} />
    </div>
  );
};

export default SankeyStaticTest; 
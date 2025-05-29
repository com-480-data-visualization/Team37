import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

interface SankeyTradeFlowProps {
  countryCode: string;
  year: string;
  productChapter: string;
}

interface SankeyCsvRow {
  year: string;
  product_chapter: string;
  exporter?: string;
  importer?: string;
  value_trln_USD: string;
}

export const SankeyTradeFlow: React.FC<SankeyTradeFlowProps> = ({ countryCode, year, productChapter }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sankeyData, setSankeyData] = useState<{nodes: any[], links: any[]} | null>(null);

  // 调试日志：组件渲染
  useEffect(() => {
    console.log('SankeyTradeFlow 渲染', { countryCode, year, productChapter });
  }, [countryCode, year, productChapter]);

  // 实例管理
  useEffect(() => {
    let chart: echarts.ECharts | null = null;
    
    const initChart = () => {
      if (!chartRef.current) return;
      // 确保在创建新实例前销毁旧实例
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
      chart = echarts.init(chartRef.current);
      chartInstance.current = chart;
      console.log('SankeyTradeFlow: ECharts 实例已创建');
    };

    initChart();

    return () => {
      if (chart) {
        chart.dispose();
        chart = null;
      }
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
      console.log('SankeyTradeFlow: ECharts 实例已销毁');
    };
  }, [countryCode, year, productChapter]);

  // 数据加载和处理
  useEffect(() => {
    if (!countryCode || !year || !productChapter) {
      setSankeyData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const importUrl = `/Team37/data/interactive/${countryCode}/top_import_srcs.csv`;
    const exportUrl = `/Team37/data/interactive/${countryCode}/top_export_dsts.csv`;
    console.log('SankeyTradeFlow 开始加载数据:', { importUrl, exportUrl });
    Promise.all([
      fetch(importUrl).then(res => res.ok ? res.text() : Promise.reject('无进口数据')),
      fetch(exportUrl).then(res => res.ok ? res.text() : Promise.reject('无出口数据'))
    ]).then(([importText, exportText]) => {
      const parseCsv = (text: string): SankeyCsvRow[] => {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        return lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: any = {};
          headers.forEach((h, i) => {
            if (h === 'value_trln_USD') {
              row[h] = parseFloat(values[i]) || 0;
            } else {
              row[h] = values[i];
            }
          });
          return row as SankeyCsvRow;
        });
      };
      const importRows = parseCsv(importText)
        .filter(row => row.year === year && row.product_chapter === productChapter)
        .sort((a, b) => parseFloat(b.value_trln_USD) - parseFloat(a.value_trln_USD))
        .slice(0, 5);
      const exportRows = parseCsv(exportText)
        .filter(row => row.year === year && row.product_chapter === productChapter)
        .sort((a, b) => parseFloat(b.value_trln_USD) - parseFloat(a.value_trln_USD))
        .slice(0, 5);
      
      console.log('SankeyTradeFlow 解析后的数据:', { importRows, exportRows });
      
      // 动态数据清洗
      const clean = (s: any) => String(s).trim();
      const center = clean(countryCode);
      // 构建所有节点名集合，确保唯一
      const allNames = new Set([
        ...importRows.map(row => clean(row.exporter)),
        center,
        ...exportRows.map(row => clean(row.importer))
      ]);
      const orderedNodes = Array.from(allNames).map(name => ({ name }));
      const importersSet = new Set(importRows.map(row => clean(row.exporter)));
      const exportersSet = new Set(exportRows.map(row => clean(row.importer)));
      // 找出所有既是进口又是出口的国家
      const cycleNodes = Array.from(importersSet).filter(x => exportersSet.has(x));
      const cycleSet = new Set(cycleNodes);
      
      console.log('SankeyTradeFlow 节点处理:', { 
        orderedNodes, 
        cycleNodes: Array.from(cycleSet),
        importersSet: Array.from(importersSet),
        exportersSet: Array.from(exportersSet)
      });
      
      // 只保留"进口国→中心国"链路，丢弃所有"中心国→cycleNode"链路
      const linksRaw = [
        ...importRows.map(row => ({
          source: clean(row.exporter),
          target: center,
          value: parseFloat(row.value_trln_USD)
        })),
        ...exportRows.map(row => ({
          source: center,
          target: clean(row.importer),
          value: parseFloat(row.value_trln_USD)
        }))
      ];
      // 彻底丢弃所有"中心国→cycleNode"链路
      const links = linksRaw.filter(l => !(l.source === center && cycleSet.has(l.target)));
      
      console.log('SankeyTradeFlow 链接处理:', { linksRaw, links });
      
      setSankeyData({ nodes: orderedNodes, links });
      setLoading(false);
    }).catch(err => {
      console.error('SankeyTradeFlow 数据加载失败:', err);
      setError(typeof err === 'string' ? err : '加载数据失败');
      setSankeyData(null);
      setLoading(false);
    });
  }, [countryCode, year, productChapter]);

  // setOption 只在数据变化时调用
  useEffect(() => {
    if (!chartInstance.current || !sankeyData || !sankeyData.nodes.length || !sankeyData.links.length) {
      console.log('SankeyTradeFlow: 跳过 setOption', {
        hasInstance: !!chartInstance.current,
        hasData: !!sankeyData,
        nodesLength: sankeyData?.nodes.length,
        linksLength: sankeyData?.links.length
      });
      return;
    }

    const option = {
      title: {
        text: `${countryCode} 贸易流向图 (${year})`,
        subtext: `产品类别: ${productChapter}`,
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>${params.data.value}`;
          }
          return params.name;
        }
      },
      series: [{
        type: 'sankey',
        data: sankeyData.nodes,
        links: sankeyData.links,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.5 },
        label: { fontSize: 12 },
        itemStyle: { color: '#3366cc', borderColor: '#333' }
      }]
    };

    try {
      console.log('SankeyTradeFlow: 准备 setOption', { option });
      console.log('option JSON', JSON.stringify(option, null, 2));
      chartInstance.current.clear();
      chartInstance.current.setOption(option, true);
      setTimeout(() => chartInstance.current?.resize(), 100);
      console.log('SankeyTradeFlow: setOption 完成');
    } catch (e) {
      console.error('SankeyTradeFlow: ECharts setOption error:', e);
    }
  }, [countryCode, year, productChapter, sankeyData]);

  // 只在窗口变化时 resize
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!countryCode) return null;
  if (loading) return <div>加载中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  return (
    <div>
      <div style={{color: 'red'}}>SankeyTest</div>
      <div
        ref={chartRef}
        style={{
          width: 800,
          height: 400,
          minWidth: 400,
          minHeight: 200,
          background: '#fff',
          border: '2px solid red',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          position: 'relative'
        }}
      />
    </div>
  );
}; 
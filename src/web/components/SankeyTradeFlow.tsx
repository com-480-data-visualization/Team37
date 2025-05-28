import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

interface SankeyTradeFlowProps {
  country: string;
  year: string;
  productChapter: string; // "incl all" 表示全部类别
}

interface ImportRow {
  year: string;
  product_chapter: string;
  exporter: string;
  value_trln_USD: string;
}
interface ExportRow {
  year: string;
  product_chapter: string;
  importer: string;
  value_trln_USD: string;
}

export const SankeyTradeFlow: React.FC<SankeyTradeFlowProps> = ({ country, year, productChapter }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  // 数据加载
  const { data: importData, loading: importLoading, error: importError } = useData<ImportRow[]>(`interactive/${country}/top_import_srcs.csv`);
  const { data: exportData, loading: exportLoading, error: exportError } = useData<ExportRow[]>(`interactive/${country}/top_export_dsts.csv`);

  // 日志输出
  console.log('【Sankey】importData:', importData);
  console.log('【Sankey】exportData:', exportData);
  console.log('【Sankey】country:', country, 'year:', year, 'productChapter:', productChapter);

  // 加载中
  if (importLoading || exportLoading) {
    return <div style={{textAlign:'center',color:'#888'}}>Sankey 图数据加载中...</div>;
  }
  // 错误
  if (importError || exportError) {
    return <div style={{textAlign:'center',color:'red'}}>Sankey 图数据加载失败</div>;
  }
  // 无数据
  if (!importData || !exportData) {
    return <div style={{textAlign:'center',color:'#888'}}>暂无贸易流向数据</div>;
  }

  useEffect(() => {
    if (!chartRef.current || !importData || !exportData) return;
    const chart = echarts.init(chartRef.current);

    // 过滤数据
    const filterByYearAndChapter = (row: any) => {
      return String(row.year) === String(year) && (productChapter === 'incl all' || row.product_chapter === productChapter);
    };
    const imports = importData.filter(filterByYearAndChapter);
    const exports = exportData.filter(filterByYearAndChapter);
    console.log('【Sankey】imports:', imports);
    console.log('【Sankey】exports:', exports);

    // Top5进口国
    const topImports = imports
      .map(row => ({
        name: row.exporter,
        value: Number(row.value_trln_USD)
      }))
      .filter(row => row.name && !isNaN(row.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    // Top5出口国
    const topExports = exports
      .map(row => ({
        name: row.importer,
        value: Number(row.value_trln_USD)
      }))
      .filter(row => row.name && !isNaN(row.value))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    console.log('【Sankey】topImports:', topImports);
    console.log('【Sankey】topExports:', topExports);

    // 无数据时不渲染
    if (topImports.length === 0 && topExports.length === 0) {
      chart.clear();
      return;
    }

    // 构建桑基图节点
    const nodes = [
      ...topImports.map(i => ({ name: i.name })),
      { name: country },
      ...topExports.map(e => ({ name: e.name }))
    ];
    // 构建桑基图links
    const links = [
      ...topImports.map(i => ({ source: i.name, target: country, value: i.value })),
      ...topExports.map(e => ({ source: country, target: e.name, value: e.value }))
    ];

    // ECharts option
    const option = {
      title: {
        text: `${country} 主要贸易流向 (Sankey)`,
        left: 'center',
        top: 10,
        textStyle: { fontSize: 20 }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>贸易额: ${params.data.value} 万亿美元`;
          }
          return params.name;
        }
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          data: nodes,
          links: links,
          emphasis: { focus: 'adjacency' },
          nodeWidth: 30,
          nodeGap: 16,
          label: {
            color: '#333',
            fontSize: 16
          },
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: '#aaa'
          }
        }
      ]
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [importData, exportData, country, year, productChapter]);

  return (
    <div style={{ width: '100%', height: 500, margin: '30px 0' }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}; 
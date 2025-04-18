import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';

// Define the interface matching the CSV structure
interface ChapterData {
  product_chapter: string;
  value_trln_USD: number;
  quantity_mln_metric_tons: number;
}

export const ChapterTotalsBarChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  // Fetch data from the specified CSV file
  const { data: chapterData, loading } = useData<ChapterData[]>('chapter_totals_2023.csv');

  useEffect(() => {
    if (!chartRef.current || !chapterData || chapterData.length === 0) return;

    // --- Data Preparation: Sort by value (descending) for better visualization ---
    const sortedData = [...chapterData].sort((a, b) => b.value_trln_USD - a.value_trln_USD);
    // --- End Data Preparation ---

    const chart = echarts.init(chartRef.current);

    const option = {
      backgroundColor: '#fff', // Match other charts
      title: {
        // text: 'Global Trade Value by Product Category (2023)', // Optional: Title within the chart
        // left: 'center',
        // textStyle: { color: '#333', fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis', // Trigger tooltip when hovering over axis
        axisPointer: {
          type: 'shadow' // Use shadow indicator for bars
        },
        formatter: (params: any) => {
          const dataItem = params[0]; // Get data for the first series (we only have one)
          // Find the original data point to get other values if needed
          const originalItem = sortedData.find(d => d.product_chapter === dataItem.name);
          if (!originalItem) return '';

          return `<b>${dataItem.name}</b><br/>
                  Value: $${originalItem.value_trln_USD.toFixed(2)} Trillion USD<br/>
                  Quantity: ${originalItem.quantity_mln_metric_tons.toFixed(0)}M Metric Tons`;
        }
      },
      grid: {
        left: '5%',   // Initial left margin
        right: '5%',  // Right margin
        bottom: '10%', // Bottom margin
        top: '5%',    // Top margin (adjust if using chart title)
        containLabel: true // IMPORTANT: Ensure labels (especially long Y-axis ones) fit
      },
      // X Axis (Value Axis for vertical bars)
      xAxis: {
        type: 'value',
        name: 'Value (Trillion USD)',
        nameLocation: 'middle',
        nameGap: 30, // Space below the axis name
        axisLabel: {
          formatter: '${value}T', // Format as Trillions
          fontSize: 12 // Adjust font size if needed
        },
        nameTextStyle: {
            fontSize: 14
        }
      },
      // Y Axis (Category Axis for vertical bars)
      yAxis: {
        type: 'category',
        data: sortedData.map(item => item.product_chapter), // Use sorted chapter names
        axisLabel: {
          fontSize: 10, // Adjust font size for potentially long labels
          interval: 0, // Show all labels
          // Optional: Rotate labels if they overlap significantly
          // rotate: 30,
          // Optional: Truncate long labels
          formatter: function (value: string) {
             return value.length > 40 ? value.substring(0, 37) + '...' : value;
          }
        },
        // Inverse order to show highest value at the top
        inverse: true
      },
      series: [
        {
          name: 'Trade Value', // Name for tooltip/legend
          type: 'bar',
          data: sortedData.map(item => item.value_trln_USD), // Use sorted values
          label: { // Optional: Show value labels on bars
            show: true,
            position: 'right', // Position labels to the right of bars
            formatter: '${c}T', // Format as Trillions (c refers to the data value)
            fontSize: 10,
            color: '#333'
          },
          itemStyle: {
            color: '#5470C6' // ECharts default blue, change as needed
            // Example gradient color:
            // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            //   { offset: 0, color: '#83bff6' },
            //   { offset: 0.5, color: '#188df0' },
            //   { offset: 1, color: '#188df0' }
            // ])
          },
          emphasis: { // Style on hover
            itemStyle: {
              color: '#91CC75' // ECharts default green, change as needed
            }
          },
          barWidth: '60%' // Adjust bar width (percentage of available space)
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
  }, [chapterData]); // Rerun effect if chapterData changes

  if (loading) {
    return <div>Loading Chart Data...</div>;
  }

  if (!chapterData || chapterData.length === 0) {
      return <div>No data available for chart.</div>;
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '500px', // Adjust height as needed for vertical bars
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px' // Consistent margin
      }}
    />
  );
};

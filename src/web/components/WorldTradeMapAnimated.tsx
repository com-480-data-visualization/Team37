import React, {useEffect, useRef, useState} from 'react';
import * as echarts from 'echarts';
import {useData} from '../hooks/useData';
import worldJson from '../assets/world.json';
import * as Prm from './params';


interface TradeData {
    year: string;
    country: string;
    value_bln_USD: number;
}

interface ProductTradeData {
    year: string;
    product_chapter: string;
    imports_trln_USD: string;
    exports_trln_USD: string;
}

interface ProductChapterMapping {
    product_chapter: string;
    description: string;
}

// struct for the two imports/exports bar chart
interface TopTradeData {
    year: string;
    product_chapter: string;
    value_trln_USD: string;
    quantity_mln_metric_tons: string;
}

// struct for sankey diagram
interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

console.log('WorldTradeMapAnimated mounted');

export const WorldTradeMapAnimated: React.FC = () => {
    // Ref for the main WorldMap Chart
    const chartRef = useRef<HTMLDivElement>(null);
    // Ref for the two bar charts for imports/exports
    const importsChartRef = useRef<HTMLDivElement>(null);
    const exportsChartRef = useRef<HTMLDivElement>(null);
    // Ref for sankey diagram
    const [sankeyChartRef] = useState(useRef<HTMLDivElement>(null));
    // Ref for the line plot
    const linePlotRef = useRef<HTMLDivElement>(null);

    const { data: allData, loading: deficitLoading } = useData<TradeData[]>('absolute_deficit_all_years.csv');
    const { data: rawChapterMappings, loading: chaptersLoading } = useData<any[]>('interactive/prod_chap_to_description.csv');
    const [year, setYear] = useState<string>('2023');
    const [playing, setPlaying] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [productData, setProductData] = useState<Record<string, Record<string, ProductTradeData[]>>>({});
    const [loadingProductData, setLoadingProductData] = useState(false);
    const [productChapters, setProductChapters] = useState<ProductChapterMapping[]>([]);
    const [currentView, setCurrentView] = useState<'total' | 'product'>('total');
    const [availableCountries, setAvailableCountries] = useState<string[]>([]);

    // Add state for bar charts (top trade data)
    const [topImportsData, setTopImportsData] = useState<Record<string, TopTradeData[]>>({});
    const [topExportsData, setTopExportsData] = useState<Record<string, TopTradeData[]>>({});
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [loadingTopData, setLoadingTopData] = useState(false);

    // State for sankey diagram (top import/export countries)
    const [topImportSources, setTopImportSources] = useState<Record<string, any[]>>({});
    const [topExportSources, setTopExportSources] = useState<Record<string, any[]>>({});

    // State for lineplot
    const [linePlotData, setLinePlotData] = useState<{ year: string, imports: number, exports: number }[]>([]);

    const loadLinePlotData = async (countryCode: string, productChapter: string) => {
        if (!countryCode || !productChapter) {
            setLinePlotData([]);
            return;
        }

        try {
            const response = await fetch(`/Team37/data/interactive/${countryCode}/surplus_deficit_by_chapter.csv`);
            if (!response.ok) throw new Error('Failed to fetch data');

            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const headers = lines[0].split(',').map(h => h.trim());

            const data = lines.slice(1)
                .map(line => {
                    const values = line.split(',');
                    const entry: any = {};
                    headers.forEach((header, i) => {
                        entry[header] = values[i];
                    });
                    return entry as ProductTradeData;
                })
                .filter(item => item.product_chapter === productChapter)
                .map(item => ({
                    year: item.year,
                    imports: (parseFloat(item.imports_trln_USD || '0') * 1000), // Convert to billions
                    exports: (parseFloat(item.exports_trln_USD || '0') * 1000)  // Convert to billions
                }))
                .sort((a, b) => parseInt(a.year) - parseInt(b.year));

            setLinePlotData(data);
        } catch (error) {
            console.error('Error loading line plot data:', error);
            setLinePlotData([]);
        }
    };

    const parseAndAggregateTradeSources = (text: string, filterYear?: string, filterProduct?: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data: any[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
                .map(v => v.trim().replace(/^"(.*)"$/, '$1'));

            if (values.length !== headers.length) continue;

            const entry: any = {};
            headers.forEach((header, index) => {
                entry[header] = values[index];
            });
            if (filterYear && String(entry.year).trim() !== String(filterYear).trim()) continue;
            if (filterProduct && String(entry.product_chapter).trim() !== String(filterProduct).trim()) continue;
            if (String(entry.year).trim() === String(filterYear).trim() &&
                String(entry.product_chapter).trim() === String(filterProduct).trim()) {
                console.log('%c命中！', 'color: green; font-weight: bold;', entry, filterYear, filterProduct);
            } else {
                console.log('未命中', entry, filterYear, filterProduct);
            }
            data.push(entry);
        }

        // Aggregate by exporter/importer
        const aggregated: Record<string, number> = {};
        data.forEach(item => {
            const key = item.exporter || item.importer;
            if (!key || key === 'Other') return; // Skip 'Other' and empty keys

            const value = parseFloat(item.value_trln_USD) || 0;
            aggregated[key] = (aggregated[key] || 0) + value;
        });

        // Convert to array, sort, and limit to top 6
        return Object.entries(aggregated)
            .map(([country, value]) => ({
                country,
                value: Math.max(0, value) // Ensure non-negative
            }))
            .sort((a, b) => b.value - a.value);
    };

    const parseCSVTopTradeBarChart = (text: string): TopTradeData[] => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return []; // Need at least header + one row

        const headers = lines[0].split(',').map(h => h.trim());
        const data: TopTradeData[] = [];

        for (let i = 1; i < lines.length; i++) {
            // Handle quoted values that might contain commas
            const values = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
                .map(v => v.trim().replace(/^"(.*)"$/, '$1'));

            if (values.length !== headers.length) continue;

            const entry: any = {};
            headers.forEach((header, index) => {
                entry[header] = values[index];
            });

            data.push(entry as TopTradeData);
        }

        return data;
    };

    // Update the loadTopTradeData function for TopTradeBarChart
    const loadTopTradeData = async (countryCode: string) => {
        if (!countryCode) return;

        setLoadingTopData(true);
        try {
            // First verify the file exists
            const importsUrl = `/Team37/data/interactive/${countryCode}/top_import_chapters.csv`;
            const exportsUrl = `/Team37/data/interactive/${countryCode}/top_export_chapters.csv`;
            const importSourcesUrl = `/Team37/data/interactive/${countryCode}/top_import_srcs.csv`;
            const exportSourceUrl = `/Team37/data/interactive/${countryCode}/top_export_dsts.csv`

            console.log(`Attempting to fetch from: ${importsUrl}`);

            const [importsRes, exportsRes, importSourcesRes, exportSourcesRes] = await Promise.all([
                fetch(importsUrl),
                fetch(exportsUrl),
                fetch(importSourcesUrl),
                fetch(exportSourceUrl)
            ]);

            // Check if we got HTML instead of CSV
            const importsText = await importsRes.text();
            const exportsText = await exportsRes.text();
            const importSourcesText = await importSourcesRes.text();
            const exportSourcesText = await exportSourcesRes.text();

            if (importsText.trim().startsWith('<!DOCTYPE') ||
                exportsText.trim().startsWith('<!DOCTYPE')) {
                throw new Error('Received HTML instead of CSV data');
            }

            // Process bar chart data
            const importsData = parseCSVTopTradeBarChart(importsText);
            const exportsData = parseCSVTopTradeBarChart(exportsText);

            // Process sankey data
            const importSources = parseAndAggregateTradeSources(importSourcesText, year, selectedProduct);
            const exportSources = parseAndAggregateTradeSources(exportSourcesText, year, selectedProduct);

            console.log('Successfully parsed:', {
                imports: importsData,
                exports: exportsData,
                importSources: importSources,
                exportSources: exportSources,
            });

            setTopImportsData(prev => ({
                ...prev,
                [countryCode]: importsData
            }));

            setTopExportsData(prev => ({
                ...prev,
                [countryCode]: exportsData
            }));

            setTopImportSources(prev => ({ 
                ...prev,
                [countryCode]: importSources
            }));

            setTopExportSources(prev => ({
                ...prev,
                [countryCode]: exportSources
            }));

        } catch (error) {
            console.error(`Failed to load top trade data for ${countryCode}:`, error);
            // Set empty data to prevent errors
            setTopImportsData(prev => ({
                ...prev,
                [countryCode]: []
            }));
            setTopExportsData(prev => ({
                ...prev,
                [countryCode]: []
            }));
            setTopImportSources(prev => ({ 
                ...prev,
                [countryCode]: []
            }));
            setTopExportSources(prev => ({
                ...prev,
                [countryCode]: []
            }));
        } finally {
            setLoadingTopData(false);
        }
    };

    const getChapterDescription = (chapterCode: string) => {
        const chapter = productChapters.find(c => c.product_chapter === chapterCode);
        return chapter ? chapter.description : `Chapter ${chapterCode}`;
    };

    // lineplot useEffects
    useEffect(() => {
        if (selectedCountry && selectedProduct) {
            loadLinePlotData(selectedCountry, selectedProduct);
        }
    }, [selectedCountry, selectedProduct]);

    useEffect(() => {
        if (!linePlotRef.current || linePlotData.length === 0) return;

        const chart = echarts.init(linePlotRef.current);
        const desc = getChapterDescription(selectedProduct);
        const first3Words = desc.split(' ').slice(0, 3).join(' ');
        const option = {
            title: {
                text: `Trade Over Time - ${first3Words}`,
                left: 'center',
                textStyle: {
                    fontSize: 16, // Consistent sub-chart title size
                    color: '#222'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const year = params[0].axisValue;
                    const imports = params[0].data;
                    const exports = params[1].data;
                    return `Year: ${year}<br/>` + // Values are now in billions
                        `Imports: ${imports.toFixed(1)} Billion USD<br/>` +
                        `Exports: ${exports.toFixed(1)} Billion USD`;
                }
            },
            legend: {
                data: ['Imports', 'Exports'],
                bottom: 0,
                textStyle: {
                    fontSize: Prm.label_fontsz // 14px
                }
            },
            xAxis: {
                type: 'category',
                data: linePlotData.map(item => item.year),
                name: 'Year',
                nameLocation: 'middle',
                nameGap: 25,
                nameTextStyle: {
                    fontSize: Prm.title_fontsz // 16px
                },
                axisLabel: {
                    fontSize: Prm.label_fontsz // 14px
                }
            },
            yAxis: {
                type: 'value',
                name: 'Value (Billion USD)', // Updated axis title
                nameLocation: 'middle',
                nameGap: 43,
                nameTextStyle: { fontSize: Prm.title_fontsz }, // 16px
                axisLabel: {
                    formatter: '{value}',
                    fontSize: Prm.label_fontsz // 14px
                }
            },
            series: [
                {
                    name: 'Imports',
                    type: 'line',
                    data: linePlotData.map(item => item.imports),
                    itemStyle: { color: Prm.map_red },
                    lineStyle: { 
                        width: 3,
                        color: Prm.map_red 
                    }
                },
                {
                    name: 'Exports',
                    type: 'line',
                    data: linePlotData.map(item => item.exports),
                    itemStyle: { color: Prm.map_blue },
                    lineStyle: { 
                        width: 3,
                        color: Prm.map_blue
                    }
                }
            ]
        };

        chart.setOption(option);

        return () => {
            chart.dispose();
        };
    }, [linePlotData, selectedCountry, selectedProduct]);

    useEffect(() => {
        if (!sankeyChartRef.current || !selectedCountry || !selectedProduct) return;

        // 读取对应国家的top_import_srcs.csv和top_export_dsts.csv
        const importSourcesUrl = `/Team37/data/interactive/${selectedCountry}/top_import_srcs.csv`;
        const exportSourcesUrl = `/Team37/data/interactive/${selectedCountry}/top_export_dsts.csv`;

        const sankeyChart = echarts.init(sankeyChartRef.current);

        Promise.all([
            fetch(importSourcesUrl).then(res => res.ok ? res.text() : ''),
            fetch(exportSourcesUrl).then(res => res.ok ? res.text() : '')
        ]).then(([importSourcesText, exportSourcesText]) => {
            // 只筛选当前year和selectedProduct的数据
            const importSourcesAll = parseAndAggregateTradeSources(importSourcesText, year, selectedProduct);
            const exportSourcesAll = parseAndAggregateTradeSources(exportSourcesText, year, selectedProduct);
            const importSources = importSourcesAll.slice(0, 6);
            const exportSources = exportSourcesAll.slice(0, 6);
            const countryName = codeToName[selectedCountry] || selectedCountry;
            const chapterDesc = getChapterDescription(selectedProduct);
            const firstWordOfChapter = chapterDesc.split(' ')[0];

            // Prepare nodes - need unique names and proper indices
            const nodes: SankeyNode[] = [
                ...importSources.map(src => ({
                    name: `${codeToName[src.country] || src.country} (Import)`
                })),
                { name: countryName },
                ...exportSources.map(src => ({
                    name: `${codeToName[src.country] || src.country} (Export)`
                }))
            ];

            // Prepare links using节点名称（string），而不是索引（number）
            const links: SankeyLink[] = [
                ...importSources.map(src => ({
                    source: `${codeToName[src.country] || src.country} (Import)`,
                    target: countryName,
                    value: src.value * 1000 // Convert to billions
                })),
                ...exportSources.map(src => ({
                    source: countryName,
                    target: `${codeToName[src.country] || src.country} (Export)` ,
                    value: src.value * 1000 // Convert to billions
                }))
            ];

            const option = {
                title: {
                    // text: `Trade Partners - ${countryName} (${year})`,
                    text: `Trade Partners: ${firstWordOfChapter} - ${countryName} (${year})`,
                    left: 'center',
                    top: 10,
                    textStyle: {
                        fontSize: 18, // Consistent sub-chart title size
                        color: '#222'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (params: any) => {
                        if (params.dataType === 'edge') {
                            // const source = nodes[params.data.source].name.replace(' (Import)', '').replace(' (Export)', '');
                            // const target = nodes[params.data.target].name.replace(' (Import)', '').replace(' (Export)', '');
                            // return `${source} → ${target}<br/>Value: ${params.data.value.toFixed(6)} Billion USD`;
                            // params.data.source and params.data.target are the string names of the nodes
                            const sourceName = (params.data.source as string).replace(' (Import)', '').replace(' (Export)', '');
                            const targetName = (params.data.target as string).replace(' (Import)', '').replace(' (Export)', '');
                            // params.data.value is already in billions from the link preparation
                            const valueInBillions = (params.data.value as number);
                            return `${sourceName} → ${targetName}<br/>Value: ${valueInBillions.toFixed(1)} Billion USD`;
                        }
                        return params.name.replace(' (Import)', '').replace(' (Export)', '');
                    }
                },
                series: [{
                    type: 'sankey',
                    layout: 'none',
                    data: nodes,
                    links: links,
                    emphasis: {
                        focus: 'adjacency'
                    },
                    nodeAlign: 'left',
                    orient: 'horizontal',
                    left: '25%',
                    top: '18%',
                    right: '15%', // Adjusted right to give more space for labels
                    bottom: '10%',
                    levels: [{
                        depth: 0,
                        itemStyle: {
                            color: Prm.map_red // Import sources
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.6
                        }
                    }, {
                        depth: 1,
                        itemStyle: {
                            color: '#BDBDBD' // Neutral color for the selected country (middle node)
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.6
                        }
                    }, {
                        depth: 2, // Added level for export destinations
                        itemStyle: {
                            color: Prm.map_blue // Export destinations
                        },
                        lineStyle: {
                            color: 'source',
                            opacity: 0.6
                        }
                    }],
                    lineStyle: {
                        curveness: 0.5,
                        // Link colors will be inherited from source node due to 'levels' config
                    },
                    label: {
                        position: 'left',
                        formatter: (params: any) => {
                            return params.name.replace(' (Import)', '').replace(' (Export)', '');
                        },
                        fontSize: 12 // Reduced font size for Sankey node labels
                    },
                    nodeWidth: 20,
                    nodeGap: 10,
                }]
            };

            sankeyChart.setOption(option);
        });

        return () => {
            sankeyChart.dispose();
        };
    }, [selectedCountry, selectedProduct, year]);

    // Load top trade data when country is selected for the two bar charts
    useEffect(() => {
        if (selectedCountry && currentView === 'total') {
            loadTopTradeData(selectedCountry);
        }
    }, [selectedCountry, currentView]);

    // Then update the getYearData function
    const getYearData = (data: TopTradeData[], year: string) => {
        if (!data || !Array.isArray(data)) return [];

        return data
            .filter(item => item?.year?.toString()?.trim() === year?.toString()?.trim())
            .sort((a, b) => {
                const valA = parseFloat(a.value_trln_USD) || 0;
                const valB = parseFloat(b.value_trln_USD) || 0;
                return valB - valA; // Descending order
            });
    };

    useEffect(() => {
        if (!importsChartRef.current || !exportsChartRef.current) return;

        const importsChart = echarts.init(importsChartRef.current);
        const exportsChart = echarts.init(exportsChartRef.current);

        const renderChart = (chart: echarts.ECharts, data: TopTradeData[], title: string) => {
            const yearData = getYearData(data, year);
            // Determine bar color based on title (import or export)
            const barColor = title.toLowerCase().includes('import') ? Prm.map_red : Prm.map_blue;

            chart.setOption({
                title: {
                    text: title,
                    left: 'center',
                    top: 10,
                    textStyle: {
                        fontSize: 18, // Consistent sub-chart title size
                        color: '#222'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function(params: any) {
                        let content = `<b>${params[0].name}</b><br/>`;
                        params.forEach((item: any) => {
                            // item.value is now in billions
                            const valueInBillions = (item.value as number);
                            content += `${item.seriesName || 'Value'}: ${valueInBillions.toFixed(1)} Billion USD<br/>`;
                        });
                        return content;
                    }
                },
                grid: {
                    left: 120,
                    right: 30,
                    top: 60,
                    bottom: 40
                },
                xAxis: {
                    type: 'value',
                    name: 'Value (Billion USD)', // Updated axis title
                    nameLocation: 'middle',
                    nameGap: 25, // Increased gap for better readability
                    nameTextStyle: { fontSize: Prm.title_fontsz }, // 16px
                    axisLabel: {
                        fontSize: Prm.label_fontsz, // 14px
                        color: '#333',
                        formatter: '{value}'
                    }
                },
                yAxis: {
                    type: 'category',
                    data: yearData.map(item => item.product_chapter),
                    nameTextStyle: {
                        fontWeight: 'bold',
                        fontSize: Prm.label_fontsz // 14px (for consistency if a name were used)
                    },
                    axisLabel: {
                        interval: 0,
                        width: 180,
                        overflow: 'truncate',
                        ellipsis: '...',
                        fontSize: Prm.label_fontsz, // 14px
                        color: '#333',
                        fontWeight: 'bold',
                        formatter: function(value: string) {
                            return value.length > 18 ? value.slice(0, 18) + '...' : value;
                        }
                    }
                },
                series: [{
                    type: 'bar',
                    // Convert value to billions
                    itemStyle: { // Set bar color
                        color: barColor
                    },
                    data: yearData.map(item => parseFloat(item.value_trln_USD) * 1000),
                    label: {
                        show: true,
                        position: 'right',
                        fontSize: Prm.label_fontsz, // 14px
                        fontWeight: 'bold',
                        color: '#333',
                        formatter: (params: any) => (params.value as number).toFixed(1) // Value is in billions
                    }
                }],
                textStyle: {
                    fontFamily: 'inherit', // Keep inherit or set specific
                    fontSize: Prm.label_fontsz, // 14px for general text within chart
                    color: '#333'
                }
            });
        };

        if (selectedCountry) {
            renderChart(
                importsChart,
                topImportsData[selectedCountry] || [],
                `Top Import Categories - ${codeToName[selectedCountry] || selectedCountry} (${year})`
            );
            renderChart(
                exportsChart,
                topExportsData[selectedCountry] || [],
                `Top Export Categories - ${codeToName[selectedCountry] || selectedCountry} (${year})`
            );
        } else {
            // Clear charts when no country selected
            importsChart.setOption({ series: [{ data: [] }] });
            exportsChart.setOption({ series: [{ data: [] }] });
        }

        return () => {
            importsChart.dispose();
            exportsChart.dispose();
        };
    }, [selectedCountry, topImportsData, topExportsData, year]);


    // Update your existing map click handler to set the selected country
    const handleMapClick = (params: any) => {
        (async () => {
            if (!params.data || !params.data.name) return;

            const countryFeature = worldJson.features.find(f =>
                f.properties?.NAME?.toLowerCase() === params.data.name.toLowerCase()
            );

            if (!countryFeature || !countryFeature.properties?.ISO_A3) return;

            const countryCode = countryFeature.properties.ISO_A3;
            console.log(countryCode)
            setSelectedCountry(countryCode);

            // Always load top trade data when a country is selected
            await loadTopTradeData(countryCode);

            if (currentView === 'product') {
                await loadProductData(countryCode);
            }
        })();
    };

    // 页面加载时获取 available_countries.json
    useEffect(() => {
        fetch('/Team37/data/interactive/available_countries.json')
            .then(res => res.json())
            .then(setAvailableCountries);
    }, []);

    // 处理章节映射
    useEffect(() => {
        if (!rawChapterMappings || rawChapterMappings.length === 0) {
            setProductChapters([]); // Ensure it's empty if no data or loading
            return;
        }
        const processedChapters: ProductChapterMapping[] = [];
        rawChapterMappings.forEach(row => {
            // Assuming 'useData' parses CSV into objects with keys matching CSV headers
            const chapterCode = row.product_chapter; // Use direct property access
            const chapterDesc = row.description;   // Use direct property access

            if (chapterCode && chapterDesc) {
                processedChapters.push({
                    product_chapter: String(chapterCode).trim(),
                    description: String(chapterDesc).trim()
                });
            } else {
                console.warn('Skipping row due to missing product_chapter or description:', row);
            }
        });
        processedChapters.sort((a, b) => a.product_chapter.localeCompare(b.product_chapter));
        setProductChapters(processedChapters);
    }, [rawChapterMappings]);

    const years = React.useMemo(() => {
        if (!allData) return [];
        const set = new Set<string>();
        allData.forEach(item => set.add(item.year));
        return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
    }, [allData]);

    const loadProductData = async (countryCode: string) => {
        if (!countryCode) return;
        setLoadingProductData(true);
        try {
            if (productData[countryCode]?.[selectedProduct]) {
                setLoadingProductData(false);
                return;
            }

            const response = await fetch(`/Team37/data/interactive/${countryCode}/surplus_deficit_by_chapter.csv`);
            if (!response.ok) {
                // 文件不存在，写入空数据
                setProductData(prev => ({
                    ...prev,
                    [countryCode]: {
                        ...(prev[countryCode] || {}),
                        [selectedProduct]: []
                    }
                }));
                return;
            }
            const text = await response.text();
            const lines = text.split('\n');
            const headers = lines[0].split(',');

            const data: ProductTradeData[] = lines.slice(1).map(line => {
                const values = line.split(',');
                const entry: any = {};
                headers.forEach((header, i) => {
                    entry[header] = values[i];
                });
                return entry as ProductTradeData;
            });

            // Organize data by product chapter
            const productChapterData: Record<string, ProductTradeData[]> = {};
            data.forEach(item => {
                if (!productChapterData[item.product_chapter]) {
                    productChapterData[item.product_chapter] = [];
                }
                productChapterData[item.product_chapter].push(item);
            });

            setProductData(prev => ({
                ...prev,
                [countryCode]: {
                    ...(prev[countryCode] || {}),
                    ...productChapterData
                }
            }));
        } catch (error) {
            // 加载失败也写入空数据
            setProductData(prev => ({
                ...prev,
                [countryCode]: {
                    ...(prev[countryCode] || {}),
                    [selectedProduct]: []
                }
            }));
            console.error(`Failed to load data for ${countryCode}:`, error);
        } finally {
            setLoadingProductData(false);
        }
    };

    // 只请求有数据国家
    useEffect(() => {
        if (currentView === 'product' && allData && selectedProduct && availableCountries.length > 0) {
            availableCountries.forEach(code => {
                if (!productData[code]?.[selectedProduct]) {
                    loadProductData(code);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentView, selectedProduct, allData, availableCountries]);

    // 设置初始年份为最新年份
    useEffect(() => {
        if (years.length > 0) {
            setYear(years[years.length - 1]);  // 设置为最后一年（最新年份）
        }
    }, [years]);

    // 动画年份切换
    useEffect(() => {
        if (!playing || years.length === 0) return;
        const idx = years.indexOf(year);
        if (idx === -1) return;
        const timer = setTimeout(() => {
            setYear(years[(idx + 1) % years.length]);
        }, 1200);
        return () => clearTimeout(timer);
    }, [playing, year, years]);

    // 判断所有国家的该产品数据是否都已加载
    const allProductDataLoaded = React.useMemo(() => {
        if (!allData || !selectedProduct) return false;
        if (currentView === 'product' && availableCountries.length > 0) {
            return availableCountries.every(code => productData[code]?.[selectedProduct]);
        } else {
            const countryCodes = Array.from(new Set(allData.map(d => d.country)));
            return countryCodes.every(code => productData[code]?.[selectedProduct]);
        }
    }, [allData, selectedProduct, productData, currentView, availableCountries]);

    // 章节描述映射
    const descriptionToChapter = React.useMemo(() => {
        const map: Record<string, string> = {};
        productChapters.forEach(item => {
            map[item.description] = item.product_chapter;
        });
        return map;
    }, [productChapters]);

    // 生成codeToName映射
    const codeToName: Record<string, string> = React.useMemo(() => {
        const map: Record<string, string> = {};
        worldJson.features.forEach(f => {
            if (f.properties?.ISO_A3 && f.properties?.NAME) {
                map[f.properties.ISO_A3] = f.properties.NAME;
            }
        });
        return map;
    }, []);

    // 国家名称匹配
        const matchCountryName = (countryCode: string, countryName: string): string => {
            if (codeToName[countryCode]) return codeToName[countryCode];
            if (Prm.countryCodeToName[countryCode]) return Prm.countryCodeToName[countryCode];
            if (Prm.countryNameAlias[countryName]) return Prm.countryNameAlias[countryName];
            const normalizedInput = countryName.toLowerCase().trim();
            const possibleMatches = Object.values(codeToName).filter(name =>
                name.toLowerCase().includes(normalizedInput) || normalizedInput.includes(name.toLowerCase())
            );
            return possibleMatches.length === 1 ? possibleMatches[0] : countryName;
        };

    // 获取国家贸易数据
        const getTradeData = (countryCode: string, countryName: string) => {
            if (currentView === 'total') {
            const item = allData?.find(d => String(d.year) === String(year) && d.country === countryCode);
                return {
                    name: matchCountryName(countryCode, countryName),
                    value: item ? Number(item.value_bln_USD) || 0 : 0
                };
            } else {
                const countryProductData = productData[countryCode]?.[selectedProduct];
            console.log('getTradeData', { countryCode, countryName, year, countryProductData });
                if (!countryProductData) {
                    return {
                        name: matchCountryName(countryCode, countryName),
                        value: 0,
                        imports: 0,
                        exports: 0
                    };
                }
            // 强制字符串比较
            const yearData = countryProductData.find(d => String(d.year) === String(year));
            console.log('yearData', { year, yearType: typeof year, yearData, allYears: countryProductData.map(d => d.year) });
                if (!yearData) {
                    return {
                        name: matchCountryName(countryCode, countryName),
                        value: 0,
                        imports: 0,
                        exports: 0
                    };
                }
            const imports = parseFloat(yearData.imports_trln_USD || '0') * 1000;
            const exports = parseFloat(yearData.exports_trln_USD || '0') * 1000;
                const balance = exports - imports;
                return {
                    name: matchCountryName(countryCode, countryName),
                    value: balance,
                    imports,
                    exports
                };
            }
        };

    // 地图数据
    const mapData = React.useMemo(() => {
        if (currentView === 'product' && availableCountries.length > 0) {
            return availableCountries
                .map(code => {
                    const name = codeToName[code] || code;
                    return getTradeData(code, name);
                })
                .filter(item => item !== null) as any[];
        } else {
        const countryCodes = new Set<string>();
            allData?.forEach(item => countryCodes.add(item.country));
            return Array.from(countryCodes)
            .map(code => {
                const name = codeToName[code] || code;
                return getTradeData(code, name);
            })
            .filter(item => item !== null) as any[];
        }
    }, [currentView, availableCountries, allData, selectedProduct, productData, productChapters, chaptersLoading, year]);

    // 计算maxRange
        const values = mapData.map(item => item.value).filter(v => !isNaN(v));
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const maxRange = Math.max(Math.abs(minValue), Math.abs(maxValue));

    // 生成 option
        const option = {
            backgroundColor: '#fff',
            title: {
        text: 'Trade Surpluses and Deficits by Category',
                left: 'center',
                top: 10, // Adjusted for visual balance with controls
                textStyle: { color: '#333', fontSize: 20 }
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
          const value = params.value || 0;
          return `${params.name}<br/>Trade ${value >= 0 ? 'Surplus' : 'Deficit'}: ${value.toFixed(2)} Billion USD`;
                }
            },
            visualMap: {
                left: 'left',
                min: -maxRange,
                max: maxRange,
        text: ['Surplus', 'Deficit'],
                realtime: false,
                calculable: true,
        inRange: { color: [Prm.map_red, '#ffffff', Prm.map_blue] }
        
            },
            series: [{
        name: 'Trade Balance',
                type: 'map',
                map: 'world',
                roam: false,
        emphasis: { 
            label: { show: true },
            itemStyle: {
                areaColor: '#FFFACD' // Milder yellow for hover
            }
        },
        data: mapData
      }]
    };

    useEffect(() => {
        console.log('WorldTradeMapAnimated: useEffect', chartRef.current, allData);
        console.log('WorldTradeMapAnimated: option', option);
        if ((option as any).series && (option as any).series[0] && (option as any).series[0].data) {
            console.log('WorldTradeMapAnimated: option.series[0].data', (option as any).series[0].data);
        }
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);
            console.log('WorldTradeMapAnimated: setOption', option);
            chart.setOption(option);
            console.log('WorldTradeMapAnimated: setOption 完成');
            chart.on('click', handleMapClick);

            // 添加resize事件监听器
            const handleResize = () => {
                chart.resize();
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chart.dispose();
            };
        }
    }, [option, allData, chartRef]);

    if (
        deficitLoading || 
        chaptersLoading || 
        (currentView === 'product' && !allProductDataLoaded)
    ) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Section (70% height) */}
            <div style={{ display: 'flex', height: '70%', gap: '20px' }}>
                {/* Left Panel (30% width) */}
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
                    {/* Controls (Adjusted to be less than 50% to give more space to line plot if needed) */}
                    <div style={{ height: '50%', padding: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Timeline section */}
                        <div>
                            <div style={{ marginBottom: '8px', fontSize: '18px', color: '#666' }}>
                                Select a year to view trade data for different periods
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px', fontWeight: 'bold', minWidth: '40px' }}>1995</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={years.length - 1}
                                    value={years.indexOf(year)}
                                    onChange={e => setYear(years[Number(e.target.value)])}
                                    style={{ flex: 1 }}
                                />
                                <span style={{ marginLeft: '10px', fontWeight: 'bold', minWidth: '40px' }}>{year}</span>
                            </div>
                        </div>

                        {/* Product selection section */}
                        <div>
                            <div style={{ marginBottom: '8px', fontSize: '18px', color: '#666' }}>
                                Choose a product category or view overall trade balance
                            </div>
                            <select 
                                value={selectedProduct}
                                onChange={(e) => {
                                    setSelectedProduct(e.target.value);
                                    if (e.target.value === "") {
                                        setCurrentView('total');
                                    } else {
                                        setCurrentView('product');
                                    }
                                }}
                                style={{ 
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    fontSize: '14px',
                                    backgroundColor: '#fff'
                                }}
                            >
                                <option value="">-- Show Total Trade Balance --</option>
                                {productChapters
                                    .slice()
                                    .sort((a, b) => a.description.localeCompare(b.description))
                                    .map(chapter => (
                                    <option key={chapter.product_chapter} value={chapter.product_chapter}>
                                        {chapter.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Line Plot (50% height) */}
                    <div
                        ref={linePlotRef}
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            padding: '10px'
                        }}
                    />
                </div>
                
                {/* World Map (70% width) */}
                <div
                    ref={chartRef}
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        minHeight: '400px'
                    }}
                />
            </div>

            {/* Bottom Section (30% height) */}
            <div style={{
                display: 'flex',
                flex: 1,
                marginTop: '20px',
                gap: '20px'
            }}>
                <div
                    ref={importsChartRef}
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                />
                <div
                    ref={sankeyChartRef}
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        minWidth: '300px'
                    }}
                />
                <div
                    ref={exportsChartRef}
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                />
            </div>

            {(loadingProductData || loadingTopData) && <div>Loading data...</div>}
        </div>
    );
};
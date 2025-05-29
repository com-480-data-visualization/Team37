import React, {useEffect, useRef, useState} from 'react';
import * as echarts from 'echarts';
import {useData} from '../hooks/useData';
import worldJson from '../assets/world.json';

// Complete ISO 3166-1 alpha-3 to English country name mapping table (including common countries and special codes)
const countryCodeToName: Record<string, string> = {
    AFG: 'Afghanistan',
    ALB: 'Albania',
    DZA: 'Algeria',
    AND: 'Andorra',
    AGO: 'Angola',
    ATG: 'Antigua and Barbuda',
    ARG: 'Argentina',
    ARM: 'Armenia',
    AUS: 'Australia',
    AUT: 'Austria',
    AZE: 'Azerbaijan',
    BHS: 'Bahamas',
    BHR: 'Bahrain',
    BGD: 'Bangladesh',
    BRB: 'Barbados',
    BLR: 'Belarus',
    BEL: 'Belgium',
    BLZ: 'Belize',
    BEN: 'Benin',
    BTN: 'Bhutan',
    BOL: 'Bolivia',
    BIH: 'Bosnia and Herzegovina',
    BWA: 'Botswana',
    BRA: 'Brazil',
    BRN: 'Brunei',
    BGR: 'Bulgaria',
    BFA: 'Burkina Faso',
    BDI: 'Burundi',
    KHM: 'Cambodia',
    CMR: 'Cameroon',
    CAN: 'Canada',
    CPV: 'Cape Verde',
    CAF: 'Central African Republic',
    TCD: 'Chad',
    CHL: 'Chile',
    CHN: 'China',
    COL: 'Colombia',
    COM: 'Comoros',
    COG: 'Congo',
    COD: 'Democratic Republic of the Congo',
    COK: 'Cook Islands',
    CRI: 'Costa Rica',
    CIV: `Côte d'Ivoire`,
    HRV: 'Croatia',
    CUB: 'Cuba',
    CYP: 'Cyprus',
    CZE: 'Czechia',
    DNK: 'Denmark',
    DJI: 'Djibouti',
    DMA: 'Dominica',
    DOM: 'Dominican Republic',
    ECU: 'Ecuador',
    EGY: 'Egypt',
    SLV: 'El Salvador',
    GNQ: 'Equatorial Guinea',
    ERI: 'Eritrea',
    EST: 'Estonia',
    SWZ: 'Eswatini',
    ETH: 'Ethiopia',
    FJI: 'Fiji',
    FIN: 'Finland',
    FRA: 'France',
    GAB: 'Gabon',
    GMB: 'Gambia',
    GEO: 'Georgia',
    DEU: 'Germany',
    GHA: 'Ghana',
    GRC: 'Greece',
    GRD: 'Grenada',
    GTM: 'Guatemala',
    GIN: 'Guinea',
    GNB: 'Guinea-Bissau',
    GUY: 'Guyana',
    HTI: 'Haiti',
    HND: 'Honduras',
    HUN: 'Hungary',
    ISL: 'Iceland',
    IND: 'India',
    IDN: 'Indonesia',
    IRN: 'Iran',
    IRQ: 'Iraq',
    IRL: 'Ireland',
    ISR: 'Israel',
    ITA: 'Italy',
    JAM: 'Jamaica',
    JPN: 'Japan',
    JOR: 'Jordan',
    KAZ: 'Kazakhstan',
    KEN: 'Kenya',
    KIR: 'Kiribati',
    KWT: 'Kuwait',
    KGZ: 'Kyrgyzstan',
    LAO: 'Laos',
    LVA: 'Latvia',
    LBN: 'Lebanon',
    LSO: 'Lesotho',
    LBR: 'Liberia',
    LBY: 'Libya',
    LIE: 'Liechtenstein',
    LTU: 'Lithuania',
    LUX: 'Luxembourg',
    MDG: 'Madagascar',
    MWI: 'Malawi',
    MYS: 'Malaysia',
    MDV: 'Maldives',
    MLI: 'Mali',
    MLT: 'Malta',
    MHL: 'Marshall Islands',
    MRT: 'Mauritania',
    MUS: 'Mauritius',
    MEX: 'Mexico',
    FSM: 'Micronesia',
    MDA: 'Moldova',
    MCO: 'Monaco',
    MNG: 'Mongolia',
    MNE: 'Montenegro',
    MAR: 'Morocco',
    MOZ: 'Mozambique',
    MMR: 'Myanmar',
    NAM: 'Namibia',
    NRU: 'Nauru',
    NPL: 'Nepal',
    NLD: 'Netherlands',
    NZL: 'New Zealand',
    NIC: 'Nicaragua',
    NER: 'Niger',
    NGA: 'Nigeria',
    MKD: 'North Macedonia',
    NOR: 'Norway',
    OMN: 'Oman',
    PAK: 'Pakistan',
    PLW: 'Palau',
    PSE: 'Palestine',
    PAN: 'Panama',
    PNG: 'Papua New Guinea',
    PRY: 'Paraguay',
    PER: 'Peru',
    PHL: 'Philippines',
    POL: 'Poland',
    PRT: 'Portugal',
    QAT: 'Qatar',
    ROU: 'Romania',
    RUS: 'Russia',
    SSD: 'South Sudan',
    ESP: 'Spain',
    LKA: 'Sri Lanka',
    SDN: 'Sudan',
    SUR: 'Suriname',
    SWE: 'Sweden',
    CHE: 'Switzerland',
    SYR: 'Syria',
    TWN: 'Taiwan',
    TJK: 'Tajikistan',
    TZA: 'Tanzania',
    THA: 'Thailand',
    TLS: 'Timor-Leste',
    TGO: 'Togo',
    TON: 'Tonga',
    TTO: 'Trinidad and Tobago',
    TUN: 'Tunisia',
    TUR: 'Turkey',
    TKM: 'Turkmenistan',
    TUV: 'Tuvalu',
    UGA: 'Uganda',
    UKR: 'Ukraine',
    ARE: 'United Arab Emirates',
    GBR: 'United Kingdom',
    USA: 'United States of America',
    URY: 'Uruguay',
    UZB: 'Uzbekistan',
    VUT: 'Vanuatu',
    VAT: 'Vatican',
    VEN: 'Venezuela',
    VNM: 'Vietnam',
    YEM: 'Yemen',
    ZMB: 'Zambia',
    ZWE: 'Zimbabwe',
    // Other common regions and special codes
    HKG: 'Hong Kong SAR',
    MAC: 'Macao SAR',
    ANT: 'Netherlands Antilles',
    SCG: 'Serbia and Montenegro',
    XKX: 'Kosovo',
    // You can add more special regions based on geoNames
};

// Add country alias mapping table
const countryNameAlias: Record<string, string> = {
    "Cape Verde": "Cabo Verde",
    "Czechia": "Czech Republic",
    "Ivory Coast": "Côte d'Ivoire",
    "eSwatini": "Swaziland",
    "Myanmar": "Burma",
    "Russia": "Russian Federation",
    "South Korea": "Republic of Korea",
    "North Korea": "Dem. People's Rep. Korea",
    "Syria": "Syrian Arab Republic",
    "Laos": "Lao People's Democratic Republic",
    "Palestine": "Palestinian Territory",
    "Vietnam": "Viet Nam",
    "Brunei": "Brunei Darussalam", 
    "Macao SAR": "Macao",
    "Hong Kong SAR": "Hong Kong",
    "United States of America": "United States",
    "Dem. Rep. Congo": "Democratic Republic of the Congo",
    "Central African Rep.": "Central African Republic",
    "Eq. Guinea": "Equatorial Guinea",
    "Dominican Rep.": "Dominican Republic",
    "Bosnia and Herz.": "Bosnia and Herzegovina",
    "Solomon Is.": "Solomon Islands",
    "Falkland Is.": "Falkland Islands",
    "Fr. S. Antarctic Lands": "French Southern and Antarctic Lands",
    "S. Sudan": "South Sudan",
    "Timor-Leste": "East Timor",
    // ...can continue to add more
};

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

    const { data: allData, loading: deficitLoading } = useData<TradeData[]>('absolute_deficit_all_years.csv');
    const { data: rawChapterMappings, loading: chaptersLoading } = useData<any[]>('interactive/prod_chap_to_description.csv');
    const [year, setYear] = useState<string>('2023');
    const [playing, setPlaying] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string>('84');
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

    const parseAndAggregateTradeSources = (text: string) => {
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
            .sort((a, b) => b.value - a.value)
            .slice(0, 6); // Only top 6
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
            const importSources = parseAndAggregateTradeSources(importSourcesText);
            const exportSources = parseAndAggregateTradeSources(exportSourcesText);

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

    // Update the Sankey useEffect
    useEffect(() => {
        if (!sankeyChartRef.current || !selectedCountry) return;

        const sankeyChart = echarts.init(sankeyChartRef.current);
        const importSources = (topImportSources[selectedCountry] || []).slice(0, 6); // Top 6 only
        const exportSources = (topExportSources[selectedCountry] || []).slice(0, 6); // Top 6 only
        const countryName = codeToName[selectedCountry] || selectedCountry;

        // Prepare nodes - need unique names and proper indices
        const nodes: SankeyNode[] = [
            { name: `${countryName} (Imports)` },
            ...importSources.map(src => ({
                name: `${codeToName[src.country] || src.country} (Import)`
            })),
            { name: `${countryName} (Exports)` },
            ...exportSources.map(src => ({
                name: `${codeToName[src.country] || src.country} (Export)`
            }))
        ];

        // Create a map from node names to their indices
        const nodeMap: Record<string, number> = {};
        nodes.forEach((node, index) => {
            nodeMap[node.name] = index;
        });

        // Prepare links using indices
        const links: SankeyLink[] = [
            // Import links (sources -> country imports)
            ...importSources.map(src => ({
                source: nodeMap[`${codeToName[src.country] || src.country} (Import)`],
                target: nodeMap[`${countryName} (Imports)`],
                value: src.value * 1000 // Convert to billions
            })),
            // Export links (country exports -> destinations)
            ...exportSources.map(src => ({
                source: nodeMap[`${countryName} (Exports)`],
                target: nodeMap[`${codeToName[src.country] || src.country} (Export)`],
                value: src.value * 1000 // Convert to billions
            }))
        ];

        const option = {
            title: {
                text: `Trade Partners - ${countryName} (${year})`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    if (params.dataType === 'edge') {
                        const source = nodes[params.data.source].name.replace(' (Import)', '').replace(' (Export)', '');
                        const target = nodes[params.data.target].name.replace(' (Import)', '').replace(' (Export)', '');
                        return `${source} → ${target}<br/>Value: ${params.data.value.toFixed(6)} Billion USD`;
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
                nodeAlign: 'right',
                levels: [{
                    depth: 0,
                    itemStyle: {
                        color: '#fbb4ae'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                }, {
                    depth: 1,
                    itemStyle: {
                        color: '#b3cde3'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                }],
                lineStyle: {
                    curveness: 0.5
                },
                label: {
                    formatter: (params: any) => {
                        return params.name.replace(' (Import)', '').replace(' (Export)', '');
                    }
                }
            }]
        };

        sankeyChart.setOption(option);

        return () => {
            sankeyChart.dispose();
        };
    }, [selectedCountry, topImportSources, topExportSources, year]);

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

            chart.setOption({
                title: {
                    text: title,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: (params: any) => {
                        return `${params.name}<br/>Value: ${params.value.toFixed(6)} Trillion USD`;
                    }
                },
                xAxis: {
                    type: 'value',
                    name: 'Value (Trillion USD)'
                },
                yAxis: {
                    type: 'category',
                    data: yearData.map(item => item.product_chapter),
                    axisLabel: {
                        interval: 0,
                        width: 150,
                        overflow: 'truncate'
                    }
                },
                series: [{
                    type: 'bar',
                    data: yearData.map(item => parseFloat(item.value_trln_USD)),
                    label: {
                        show: true,
                        position: 'right',
                        formatter: (params: any) => params.value.toFixed(6)
                    }
                }]
            });
        };

        if (selectedCountry) {
            renderChart(
                importsChart,
                topImportsData[selectedCountry] || [],
                `Top Imports - ${codeToName[selectedCountry] || selectedCountry} (${year})`
            );
            renderChart(
                exportsChart,
                topExportsData[selectedCountry] || [],
                `Top Exports - ${codeToName[selectedCountry] || selectedCountry} (${year})`
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
    const handleMapClick = async (params: any) => {
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
    };

    // 页面加载时获取 available_countries.json
    useEffect(() => {
        fetch('/Team37/data/interactive/available_countries.json')
            .then(res => res.json())
            .then(setAvailableCountries);
    }, []);

    // 处理章节映射
    useEffect(() => {
        if (!rawChapterMappings) return;
        const processedChapters: ProductChapterMapping[] = [];
        rawChapterMappings.forEach(row => {
            const descStr = row['0'] || '';
            try {
                const cleanStr = descStr.replace(/{|}/g, '');
                const parts = cleanStr.split(':');
                if (parts.length === 2) {
                    const chapterCode = parts[0].trim().replace(/'/g, '');
                    const chapterDesc = parts[1].trim().replace(/'/g, '');
                    if (chapterCode && chapterDesc) {
                        processedChapters.push({
                            product_chapter: chapterCode,
                            description: chapterDesc
                        });
                    }
                }
            } catch (error) {
                console.error('Error parsing chapter description:', error);
            }
        });
        processedChapters.sort((a, b) => a.product_chapter.localeCompare(b.product_chapter));
        setProductChapters(processedChapters);
    }, [rawChapterMappings]);

    const years = React.useMemo(() => {
        if (!allData) return [];
        const set = new Set<string>();
        allData.forEach(item => set.add(item.year));
        return Array.from(set).sort();
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
        if (countryCodeToName[countryCode]) return countryCodeToName[countryCode];
        if (countryNameAlias[countryName]) return countryNameAlias[countryName];
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
        top: 20,
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
        inRange: { color: ['#ff0000', '#ffffff', '#0000ff'] }
      },
      series: [{
        name: 'Trade Balance',
        type: 'map',
        map: 'world',
        roam: false,
        emphasis: { label: { show: true } },
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
        <div style={{ width: '100%', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <button onClick={() => setPlaying(prev => !prev)} style={{ marginRight: 10 }}>
                    {playing ? 'Pause' : 'Play'}
                </button>
                <input
                    type="range"
                    min={0}
                    max={years.length - 1}
                    value={years.indexOf(year)}
                    onChange={e => setYear(years[Number(e.target.value)])}
                    style={{ flex: 1 }}
                />
                <span style={{ marginLeft: 10, fontWeight: 'bold' }}>{year}</span>
                
                <select 
                    value={selectedProduct}
                    onChange={(e) => {
                        setSelectedProduct(e.target.value);
                        setCurrentView('product');
                    }}
                    style={{ marginLeft: 20, padding: '5px 10px', minWidth: '300px' }}
                >
                    <option value="">-- Show Total Trade Balance --</option>
                    {productChapters.map(chapter => (
                        <option key={chapter.product_chapter} value={chapter.product_chapter}>
                            {chapter.description}
                        </option>
                    ))}
                </select>

                <button 
                    onClick={() => setCurrentView('total')}
                    style={{ marginLeft: 10, padding: '5px 10px' }}
                    disabled={currentView === 'total'}
                >
                    Show Total Trade
                </button>
            </div>
            <div ref={chartRef} style={{
                width: '100%', height: '600px', backgroundColor: '#fff', borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }} />
            {/* Add the new bar charts container */}
            <div style={{ 
                display: 'flex', 
                marginTop: '20px',
                gap: '20px'
            }}>
                <div 
                    ref={importsChartRef} 
                    style={{
                        width: '33.3%', 
                        height: '400px', 
                        backgroundColor: '#fff', 
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} 
                />
                <div
                    ref={sankeyChartRef}
                    style={{
                        width: '33.3%',
                        height: '400px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        minWidth: '300px',
                    }}
                />
                <div 
                    ref={exportsChartRef} 
                    style={{
                        width: '33.3%', 
                        height: '400px', 
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
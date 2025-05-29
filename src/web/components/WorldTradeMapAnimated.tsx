import React, {useEffect, useRef, useState} from 'react';
import * as echarts from 'echarts';
import {useData} from '../hooks/useData';
import worldJson from '../assets/world.json';
import { SankeyTradeFlow } from './SankeyTradeFlow';
import SankeyStaticTest from './SankeyStaticTest';

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

console.log('WorldTradeMapAnimated mounted');

export const WorldTradeMapAnimated: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
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
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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
            if (!countryProductData) {
                return {
                    name: matchCountryName(countryCode, countryName),
                    value: 0,
                    imports: 0,
                    exports: 0
                };
            }
            const yearData = countryProductData.find(d => d.year === year);
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
        }
    }, [option, allData, chartRef]);

    // 地图点击事件
    useEffect(() => {
        if (!chartRef.current) return;
        const chart = echarts.init(chartRef.current);
        chart.on('click', (params: any) => {
            if (params && params.name && codeToName) {
                // 反查ISO代码
                const code = Object.keys(codeToName).find(k => codeToName[k] === params.name);
                if (code && availableCountries.includes(code)) {
                    setSelectedCountry(code);
                } else {
                    setSelectedCountry(null);
                }
            }
        });
        return () => { chart.off('click'); };
    }, [chartRef, codeToName, availableCountries]);

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
            {loadingProductData && <div>Loading product data...</div>}
            {/* Sankey 图容器 */}
            <div id="sankey-container" style={{ width: '100%', height: 400, marginTop: 20 }}>
                <SankeyTradeFlow 
                  key={year + '-' + selectedProduct + '-' + (selectedCountry || 'USA')}
                  countryCode={selectedCountry || 'USA'} 
                  year={year} 
                  productChapter={selectedProduct} 
                />
            </div>
            <SankeyStaticTest />
        </div>
    );
};
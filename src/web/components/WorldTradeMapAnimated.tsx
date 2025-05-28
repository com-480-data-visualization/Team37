import React, {useEffect, useRef} from 'react';
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

interface WorldTradeMapAnimatedProps {
  selectedCountry: string | null;
  onCountrySelect: (country: string) => void;
  selectedYear: string;
  selectedProductChapter: string;
}

export const WorldTradeMapAnimated: React.FC<WorldTradeMapAnimatedProps> = ({
  selectedCountry,
  onCountrySelect,
  selectedYear,
  selectedProductChapter
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { data: allData, loading } = useData<TradeData[]>('absolute_deficit_all_years.csv');

    useEffect(() => {
        if (!chartRef.current || !allData) return;
        const chart = echarts.init(chartRef.current);
        echarts.registerMap('world', worldJson as any);

        console.log('原始数据:', allData.slice(0, 5));

        // 只筛选当前年份
        const yearData = allData.filter(item => String(item.year) === String(selectedYear));
        console.log('年份筛选后:', yearData.slice(0, 5));

        const codeToName: Record<string, string> = {};
        worldJson.features.forEach(f => {
            if (f.properties?.ISO_A3 && f.properties?.NAME) {
                codeToName[f.properties.ISO_A3] = f.properties.NAME;
            }
        });

        const geoNameMap: Record<string, string> = {};
        worldJson.features.forEach(f => {
            if (f.properties?.NAME) {
                geoNameMap[f.properties.NAME.toLowerCase()] = f.properties.NAME;
            }
        });

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

        const mapData = yearData.map(item => {
            const value = Number(item.value_bln_USD);
            if (isNaN(value)) {
                console.warn('无效的数值:', item);
                return null;
            }
            let name = matchCountryName(item.country, item.country);
            const geoName = geoNameMap[name.toLowerCase()];
            return { name: geoName || name, value };
        }).filter((item): item is { name: string; value: number } => item !== null);

        console.log('地图数据:', mapData.slice(0, 5));

        const geoNames = worldJson.features.map(f => f.properties?.NAME).filter(Boolean);
        const geoNamesSet = new Set(geoNames.map(n => n.toLowerCase()));
        const filteredMapData = mapData.filter(item => geoNamesSet.has(item.name.toLowerCase()));
        const finalMapData = filteredMapData.length > 0 ? filteredMapData : mapData;

        console.log('过滤后数据:', finalMapData.slice(0, 5));

        // 数据处理
        const finalMapDataFixed = finalMapData.map(item => {
            const countryName = matchCountryName(item.name, countryCodeToName[item.name] || item.name);
            const value = parseFloat(item.value?.toString() || '0');
            if (isNaN(value)) {
                console.warn('无效的数值:', item);
                return null;
            }
            return {
                name: countryName,
                value: value
            };
        }).filter((item): item is { name: string; value: number } => item !== null);

        console.log('最终数据:', finalMapDataFixed.slice(0, 5));

        const values = finalMapDataFixed.map(item => item.value).filter(v => !isNaN(v));
        console.log('数值范围:', values.slice(0, 5));

        const minValue = values.length ? Math.min(...values) : -1;
        const maxValue = values.length ? Math.max(...values) : 1;
        // 保证 maxRange 至少为1，且不是NaN
        const maxRange = Math.max(Math.abs(minValue), Math.abs(maxValue), 1);

        console.log('数据范围:', { minValue, maxValue, maxRange });

        const option = {
            backgroundColor: '#fff',
            title: {
                text: `Trade Balance in Nominal USD (${selectedYear})`,
                left: 'center',
                top: 20,
                textStyle: { color: '#333', fontSize: 20 }
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    if (!params || !params.data) {
                        return `${params.name}<br/>No data available`;
                    }
                    const value = params.data.value;
                    if (typeof value !== 'number' || isNaN(value)) {
                        return `${params.name}<br/>No data available`;
                    }
                    return `${params.name}<br/>Trade ${value >= 0 ? 'Surplus' : 'Deficit'}: ${value.toFixed(2)} 十亿美元`;
                }
            },
            visualMap: {
                min: -maxRange,
                max: maxRange,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['#ff0000', '#ffffff', '#00ff00']
                }
            },
            series: [
                {
                    name: 'World Trade',
                    type: 'map',
                    map: 'world',
                    roam: true,
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: finalMapDataFixed
                }
            ]
        };
        chart.setOption(option);

        // 高亮选中
        if (selectedCountry) {
          chart.dispatchAction({
            type: 'mapSelect',
            name: selectedCountry
          });
        }

        // 点击事件
        chart.off('click');
        chart.on('click', (params: any) => {
          if (params.name) {
            onCountrySelect(params.name);
          }
        });

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [allData, selectedYear, selectedCountry, onCountrySelect]);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                {/* 这里可以加年份/类别选择器 */}
            </div>
            <div ref={chartRef} style={{
                width: '100%', height: '600px', backgroundColor: '#fff', borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }} />
        </div>
    );
};
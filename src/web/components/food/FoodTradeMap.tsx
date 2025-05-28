import React, {useEffect, useRef} from 'react';
import * as echarts from 'echarts';
import {useData} from '../../hooks/useData';
import worldJson from '../../assets/world.json';


// TODO: refactor and merge non-interactive maps to avoid duplication.

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

export const FoodTradeMap: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: allData, loading } = useData<TradeData[]>('absolute_food_deficit_2023.csv');

  useEffect(() => {
    if (!chartRef.current || !allData) return;

    const chart = echarts.init(chartRef.current);

    worldJson.features.forEach(f => { f.properties.name = f.properties.NAME; });
    echarts.registerMap('world', worldJson as any);

    const countryCodeMapping = worldJson.features.reduce((acc, f) => {
      const { ISO_A3, NAME } = f.properties;
      if (ISO_A3 && NAME) acc[ISO_A3] = NAME;
      return acc;
    }, {} as Record<string, string>);

    const geoNameMapping = worldJson.features.reduce((acc, f) => {
      const name = f.properties?.NAME?.toLowerCase();
      if (name) acc[name] = f.properties?.NAME;
      return acc;
    }, {} as Record<string, string>);

    const getCountryName = (countryCode: string, countryName: string): string => {
      if (countryCodeMapping[countryCode]) return countryCodeMapping[countryCode];
      if (countryCodeToName[countryCode]) return countryCodeToName[countryCode];
      if (countryNameAlias[countryName]) return countryNameAlias[countryName];

      const normalizedInput = countryName.toLowerCase().trim();
      const possibleMatches = Object.values(countryCodeMapping).filter(name =>
        name.toLowerCase().includes(normalizedInput) ||
        normalizedInput.includes(name.toLowerCase())
      );

      return possibleMatches.length === 1 ? possibleMatches[0] : countryName;
    };

    const mapData = allData.map(item => {
      const name = getCountryName(item.country, item.country);
      const geoName = geoNameMapping[name.toLowerCase()];
      return { name: geoName || name, value: Number(item.value_bln_USD) || 0 };
    });

    const validGeoNames = new Set(worldJson.features.map(f => f.properties?.NAME?.toLowerCase()));
    const filteredMapData = mapData.filter(item => validGeoNames.has(item.name.toLowerCase()));
    const finalMapData = filteredMapData.length > 0 ? filteredMapData : mapData;

    const values = finalMapData.map(item => item.value).filter(v => !isNaN(v));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const maxRange = Math.max(minValue, maxValue)

    const option = {
      backgroundColor: '#fff',
      title: {
        // text: 'Trade Suprluses and Deficits in $ Billion in 2023',
        // subtext: 'Unit: Billion USD',
        left: 'center',
        top: 20,
        textStyle: { color: '#333', fontSize: 20 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = params.value || 0;
          return `${params.name}<br/>Food-related trade ${value >= 0 ? 'Surplus' : 'Deficit'}: ${value.toFixed(2)} Billion USD`;
        }
      },
      visualMap: {
        left: 'left',
        min: maxRange,
        max: -maxRange,
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
        data: finalMapData
      }]
    };

    chart.setOption(option);
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [allData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
      <div ref={chartRef} style={{
        width: '100%', height: '800px', backgroundColor: '#fff',
        borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }} />
    </div>
  );
};
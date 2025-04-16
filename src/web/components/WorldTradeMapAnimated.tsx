import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../hooks/useData';
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
  value_trln_USD: number;
}

export const WorldTradeMapAnimated: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: allData, loading } = useData<TradeData[]>('absolute_deficit_all_years.csv');
  const [year, setYear] = useState<string>('2023');
  const [playing, setPlaying] = useState(false);

  
  const years = React.useMemo(() => {
    if (!allData) return [];
    const set = new Set<string>();
    allData.forEach(item => set.add(item.year));
    return Array.from(set).sort();
  }, [allData]);

  // Year switching animation
  useEffect(() => {
    if (!playing || years.length === 0) return;
    const idx = years.indexOf(year);
    if (idx === -1) return;
    const timer = setTimeout(() => {
      setYear(years[(idx + 1) % years.length]);
    }, 1200);
    return () => clearTimeout(timer);
  }, [playing, year, years]);

  useEffect(() => {
    if (!chartRef.current || !allData) return;
    const chart = echarts.init(chartRef.current);
    echarts.registerMap('world', worldJson as any);
    // Filter data for current year
    const yearData = allData.filter(item => String(item.year) === String(year));
    // Generate mapping between English country names and three-letter codes
    const codeToName: Record<string, string> = {};
    (worldJson.features || []).forEach(f => {
      if (f.properties?.ISO_A3 && f.properties?.NAME) {
        codeToName[f.properties.ISO_A3] = f.properties.NAME;
      }
    });

    // Generate geoNameMap for automatic alignment
    const geoNameMap: Record<string, string> = {};
    (worldJson.features || []).forEach(f => {
      if (f.properties?.NAME) {
        geoNameMap[f.properties.NAME.toLowerCase()] = f.properties.NAME;
      }
    });

    // Function to automatically match country names
    const matchCountryName = (countryCode: string, countryName: string): string => {
      // 1. First try direct matching
      if (codeToName[countryCode]) {
        return codeToName[countryCode];
      }

      // 2. Try looking up in countryCodeToName
      if (countryCodeToName[countryCode]) {
        return countryCodeToName[countryCode];
      }

      // 3. Try alias mapping
      if (countryNameAlias[countryName]) {
        return countryNameAlias[countryName];
      }

      // 4. Try fuzzy matching
      const normalizedInput = countryName.toLowerCase().trim();
      const possibleMatches = Object.values(codeToName).filter(name => 
        name.toLowerCase().includes(normalizedInput) || 
        normalizedInput.includes(name.toLowerCase())
      );

      if (possibleMatches.length === 1) {
        return possibleMatches[0];
      }

      // 5. If still no match found, return original name
      return countryName;
    };

    // Generate mapData, using English country names and automatically aligning with geoJSON
    const mapData = yearData.map(item => {
      let name = matchCountryName(item.country, item.country);
      // Automatically align with geoJSON name
      const geoName = geoNameMap[name.toLowerCase()];
      return {
        name: geoName || name,
        value: Number(item.value_trln_USD) || 0
      };
    });
    // geoNames still use English country names
    const geoNames = (worldJson.features || []).map(f => f.properties?.NAME).filter(Boolean);
    const geoNamesSet = new Set(geoNames.map(n => n.toLowerCase())); // All lowercase
    const unmatched = mapData.filter(item => !geoNamesSet.has(item.name.toLowerCase()));
    const filteredMapData = mapData.filter(item => geoNamesSet.has(item.name.toLowerCase()));
    
    // Debug output
    console.log('yearData:', yearData);
    console.log('mapData:', mapData);
    console.log('geoNames:', geoNames);
    console.log('filteredMapData:', filteredMapData);
    console.log('unmatched:', unmatched);

    // If filteredMapData is empty, use mapData directly
    const finalMapData = filteredMapData.length > 0 ? filteredMapData : mapData;

    // Calculate dynamic min/max
    const values = finalMapData.map(item => item.value).filter(v => typeof v === 'number' && !isNaN(v));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    console.log('minValue:', minValue, 'maxValue:', maxValue);
    console.log('finalMapData:', finalMapData.slice(0, 10));
    console.log('Top 10 value distribution:', values.slice(0, 10));
    console.log('filteredMapData sample:', finalMapData.slice(0, 10));
    console.log('Unmatched countries sample:', unmatched.slice(0, 10));
    if (worldJson.features && worldJson.features.length > 0) {
      console.log('worldJson.features[0].properties:', worldJson.features[0].properties);
    }
    const option = {
      backgroundColor: '#fff',
      title: {
        text: `World Trade Balance Map (${year})`,
        subtext: 'Unit: Trillion USD',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#333',
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const value = params.value || 0;
          return `${params.name}<br/>Trade ${value >= 0 ? 'Surplus' : 'Deficit'}: ${value.toFixed(6)} Trillion USD`;
        }
      },
      visualMap: {
        left: 'left',
        min: minValue,
        max: maxValue,
        text: ['Surplus', 'Deficit'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['#ff0000', '#ffffff', '#0000ff']
        }
      },
      series: [
        {
          name: 'Trade Balance',
          type: 'map',
          map: 'world',
          roam: true,
          emphasis: {
            label: {
              show: true
            }
          },
          data: finalMapData
        }
      ]
    };
    console.log('option.series[0].data:', option.series[0].data.slice(0, 10));
    chart.setOption(option, { notMerge: true, lazyUpdate: false });
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [allData, year]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', margin: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <button onClick={() => setPlaying(p => !p)} style={{ marginRight: 10 }}>
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
      </div>
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};
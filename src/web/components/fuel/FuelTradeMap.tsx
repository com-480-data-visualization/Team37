import React, {useEffect, useRef} from 'react';
import * as echarts from 'echarts';
import {useData} from '../../hooks/useData';
import worldJson from '../../assets/world.json';
import * as Prm from '../params';


interface TradeData {
  year: string;
  country: string;
  value_bln_USD: number;
}

export const FuelTradeMap: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { data: allData, loading } = useData<TradeData[]>('absolute_fuel_deficit_2023.csv');

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
      if (Prm.countryCodeToName[countryCode]) return Prm.countryCodeToName[countryCode];
      if (Prm.countryNameAlias[countryName]) return Prm.countryNameAlias[countryName];

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
          return `${params.name}<br/>Fuel-related trade ${value >= 0 ? 'Surplus' : 'Deficit'}: ${value.toFixed(2)} Billion USD`;
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
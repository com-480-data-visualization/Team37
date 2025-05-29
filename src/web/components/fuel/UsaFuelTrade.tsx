import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { useData } from '../../hooks/useData';

const eventData = {
    "1998": {
        title: "First economical shale well",
        description: "Cheap low-viscosity fluid finally cracked tight rock at commercial rates, proving shale could flow if fracked properly.",
        newsUrl: "https://en.wikipedia.org/wiki/Shale_gas#History"
    },
    "2003": {
        title: "Texas Shale-Gas Tax Break",
        description: "In 2003 the Texas legislature made a temporary incentive permanent: gas wells that are costly to drill—such as those bored into hard shale—would pay almost no state production tax. By slashing a tax that was normally about 7½ percent, the state cut the cost of each cubic foot of shale gas and gave drillers a strong, long-term reason to ramp up activity in the Barnett Shale and, later, other plays.",
        newsUrl: "https://en.wikipedia.org/wiki/Severance_tax"
    },
    "2005": {
        title: "Energy Policy Act of 2005",
        description: "§322/328 exempts most hydraulic-fracturing fluids from the Safe Drinking Water Act's UIC program; removes a looming federal permit layer as drilling accelerates.",
        newsUrl: "https://en.wikipedia.org/wiki/Energy_Policy_Act_of_2005"
    },
    "2012": {
        title: "The Marcellus Shale Law",
        description: "Pennsylvania overhauls its 1984 Oil & Gas Act, swaps municipal patchwork for statewide standards and an impact fee; operators gain regulatory certainty for Marcellus build-out.",
        newsUrl: "https://en.wikipedia.org/wiki/Fracking_in_the_United_States#The_Marcellus_Shale_Law_(House_Bill_1950)"
    }
};

const curve_color_red = "#B22234"
const curve_color_blue = "#3C3B6E"
const large_marker_size = 20
const marker_size = 16
const marker_shape = 'circle'
const line_width = 6
const title_fontsz = 16
const label_fontsz = 14

interface TradeFlowData {
    year: number;
    imports_trln_USD: number;
    imports_mln_metric_tons: number;
    exports_trln_USD: number;
    exports_mln_metric_tons: number;
    balance_trln_USD: number;
    balance_mln_metric_tons: number;
}

export const UsaFuelTrade: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [selectedPoint, setSelectedPoint] = useState<{ year: number; value: number } | null>(null);
    const { data: flowData, loading } = useData<TradeFlowData[]>('country_specific/USA/fuel_trade.csv');

    useEffect(() => {
        if (!chartRef.current || !flowData) return;

        const chart = echarts.init(chartRef.current);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow', // better for bar charts (you can use 'line' if preferred)
                    label: { backgroundColor: '#6a7985' }
                },
                formatter: (params: any[]) => {
                    // Use the first point’s x-axis label
                    const category = params[0].name;
                    let s = `<b>${category}</b><br/>`;
                    params.forEach(p => {
                        s += `${p.marker}${p.seriesName}: ${p.value}<br/>`;
                    });
                    return s;
                }
            },
            xAxis: {
                type: 'category',
                data: flowData.map((d) => d.year),
                axisLabel: {
                    fontSize: label_fontsz,
                }
            },
            yAxis: {
                type: 'value',
                name: 'Mineral Fuel Balance (Mil. Tons)',
                nameTextStyle: {
                    fontSize: title_fontsz,   // ← set your desired font size here
                    fontWeight: 'bold',      // optional
                },
                axisLabel: {
                    fontSize: label_fontsz,
                }
            },
            series: [
                {
                    name: 'Mineral Fuel Trade Balance (Million Metric Tons)',
                    type: 'line',
                    data: flowData.map(d => ({
                        value: d.balance_mln_metric_tons,
                        itemStyle: {
                            color: eventData[d.year] ? curve_color_red : curve_color_blue,
                            borderColor: eventData[d.year] ? '#FFF' : 'transparent',
                            borderWidth: eventData[d.year] ? 2 : 0,
                            shadowColor: eventData[d.year] ? 'rgba(255,107,107,0.5)' : 'transparent',
                            shadowBlur: eventData[d.year] ? 10 : 0
                        },
                        symbolSize: eventData[d.year] ? large_marker_size : marker_size,
                        symbol: eventData[d.year] ? 'triangle' : marker_shape,
                    })),
                    lineStyle: {
                        color: curve_color_blue,   // line color
                        width: line_width            // optional: line width
                    },
                    itemStyle: {
                        color: curve_color_blue    // marker (symbol) color
                    },
                    // symbol: marker_shape,
                    // symbolSize: marker_size,
                    smooth: true
                },

            ]
        };

        chart.setOption(option);

        // Click event handler
        chart.on('click', (params: any) => {
            if (params.componentType === 'series') {
                const year = flowData[params.dataIndex].year;
                const value = flowData[params.dataIndex].balance_mln_metric_tons;
                setSelectedPoint({ year, value });
            }
        });

        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [flowData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ position: 'relative' }}>
            <div ref={chartRef} style={{ width: '100%', height: '400px' }} />

            {selectedPoint && eventData[selectedPoint.year] && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0)',
                            zIndex: 999
                        }}
                        onClick={() => setSelectedPoint(null)}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            maxWidth: '250px'
                        }}
                    >
                        <button
                            onClick={() => setSelectedPoint(null)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}
                        >×</button>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>
                            <a
                                href={eventData[selectedPoint.year].newsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: '#1a0dab',           // typical link blue (Google-style)
                                    textDecoration: 'underline', // underline the text
                                    fontWeight: 'normal'         // optional: keep weight normal inside h3
                                }}
                            >
                                {eventData[selectedPoint.year].title} ({selectedPoint.year})
                            </a>
                        </h3>
                        <p style={{ fontSize: '0.9rem' }}>
                            {eventData[selectedPoint.year].description}
                        </p>
                        <a
                            href={eventData[selectedPoint.year].newsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                        </a>
                        <p style={{ fontSize: '0.9rem' }}>
                            Value: {selectedPoint.value.toLocaleString()} mln tons
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

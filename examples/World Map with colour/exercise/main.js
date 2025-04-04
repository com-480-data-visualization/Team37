class WorldMap {
	constructor(svg_element_id) {
		this.svg = d3.select('#' + svg_element_id);
		if (!this.svg.empty()) {
			// SVG element exists, proceed with initialization
		} else {
			console.error("SVG element not found!");
			return;
		}
		
		// Set map projection
		this.projection = d3.geoMercator()
			.scale(150)
			.center([0, 20])
			.translate([480, 250]);

		// Create path generator
		this.path = d3.geoPath().projection(this.projection);

		// Create color scale
		this.colorScale = d3.scaleLinear()
			.domain([-700000, 0, 500000])
			.range(['#ff0000', '#ffffff', '#00ff00']);  // Use brighter colors

		// Create numeric to alpha country code mapping
		const numericToAlpha = {
			'840': 'USA',  // United States
			'156': 'CHN',  // China
			'276': 'DEU',  // Germany
			'392': 'JPN',  // Japan
			'826': 'GBR',  // United Kingdom
			'250': 'FRA',  // France
			'356': 'IND',  // India
			'380': 'ITA',  // Italy
			'076': 'BRA',  // Brazil
			'124': 'CAN',  // Canada
			'643': 'RUS',  // Russia
			'410': 'KOR',  // South Korea
			'036': 'AUS',  // Australia
			'484': 'MEX',  // Mexico
			'360': 'IDN',  // Indonesia
			'792': 'TUR',  // Turkey
			'682': 'SAU',  // Saudi Arabia
			'528': 'NLD',  // Netherlands
			'702': 'SGP',  // Singapore
			'756': 'CHE'   // Switzerland
		};

		// Load trade data
		d3.csv("./data/trade-data.csv").then(data => {
			// Create mapping from country code to data
			const tradeDataMap = {};
			data.forEach(d => {
				if (d.country_code && d.net_trade) {
					tradeDataMap[d.country_code] = {
						netTrade: parseFloat(d.net_trade),
						imports: parseFloat(d.imports),
						exports: parseFloat(d.exports),
						name: d.country_name
					};
				}
			});
			
			// Load world map data
			return d3.json("https://unpkg.com/world-atlas@2/countries-110m.json").then(mapData => {
				const countries = topojson.feature(mapData, mapData.objects.countries);
				
				// Draw country boundaries
				const paths = this.svg.selectAll("path.country")
					.data(countries.features)
					.enter()
					.append("path")
					.attr("class", "country")
					.attr("d", this.path);
				
				// Set fill colors
				paths.attr("fill", d => {
					const numericCode = d.id;
					const alphaCode = numericToAlpha[numericCode];
					const countryData = tradeDataMap[alphaCode];
					
					if (countryData) {
						return this.colorScale(countryData.netTrade);
					} else {
						return "#f0f0f0";
					}
				})
				.attr("stroke", "#999")
				.attr("stroke-width", "0.5px");

				// Add mouse interactions
				paths.on("mouseover", (event, d) => {
					const countryData = tradeDataMap[d.properties.iso_a3];
					if (countryData) {
						d3.select(event.currentTarget)
							.attr("stroke", "#333")
							.attr("stroke-width", "2px");
					}
				})
				.on("mouseout", (event, d) => {
					d3.select(event.currentTarget)
						.attr("stroke", "#999")
						.attr("stroke-width", "0.5px");
				})
				.append("title")
				.text(d => {
					const countryData = tradeDataMap[d.properties.iso_a3];
					if (countryData) {
						return `${d.properties.name}
Imports: ${countryData.imports.toLocaleString()}
Exports: ${countryData.exports.toLocaleString()}
Net Trade: ${countryData.netTrade.toLocaleString()}`;
					}
					return d.properties.name;
				});

				// Add legend
				this.addLegend();
			});
		}).catch(error => {
			console.error("Error loading data:", error);
		});
	}

	addLegend() {
		const legend = this.svg.append("g")
			.attr("class", "legend")
			.attr("transform", "translate(20, 20)");

		// Add legend title
		legend.append("text")
			.attr("x", 0)
			.attr("y", -10)
			.text("Net Trade")
			.attr("font-size", "12px")
			.attr("font-weight", "bold");

		// Create legend items
		const legendData = [
			{ color: "#00ff00", text: "Net Exporter" },
			{ color: "#ffffff", text: "Trade Balance" },
			{ color: "#ff0000", text: "Net Importer" }
		];

		legendData.forEach((d, i) => {
			const g = legend.append("g")
				.attr("transform", `translate(0, ${i * 20})`);

			g.append("rect")
				.attr("width", 15)
				.attr("height", 15)
				.attr("fill", d.color)
				.attr("stroke", "#999");

			g.append("text")
				.attr("x", 20)
				.attr("y", 12)
				.text(d.text)
				.attr("font-size", "10px");
		});
	}
}

// Create map when document is loaded
document.addEventListener('DOMContentLoaded', () => {
	new WorldMap('world-map');
});

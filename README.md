# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Huiyun Zhu | | 355235 |
| Konstantinos Prasopoulos | 285813 |
| Yuchen Qian | |322420 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (21st March, 5pm)

**10% of the final grade** 

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

#### Dataset: CEPII BACI Bilateral Trade flows

CEPII is a French research center that specializes in the world economy.
They publish the [BACI Bilateral Trade Flows dataset](https://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37), which is a cleaner, reconciled, and more readily available version of the UN Comtrade database.
This dataset contains the value of all bilateral imports and exports between countries and for thousands of product categories. The dataset does not include data on the import and export of services.

We are focusing on data following the "Harmonized System 1992 (HS 1992)" classification, which allows us to explore trade data between 1995 and 2023 to observe long-term trends.

The dataset is ~8GB in size and has the following features for each year:
* Product Code (~5000 different categories)
* Exporting Country (238 Countries)
* Importing Country
* Yearly Value in Nominal US Dollars (thousands)
* Yearly Weight in metric tons.

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

#### Problematic: Trade and Globalization since the "End of History"

After the early 90s, globalization accelerated with clear manifestations in the proliferation of free trade agreements, the transfer of industry to regions with cheaper labor, and the establishment of shallow supply chains involving high levels of geographic inter-depency.
For many of us, this direction appeared to be inevitable and permanent.
In recent years, however, the economic world order established after "The End of History" shows signs that it may be unraveling.

In this sense, this is the right moment to peek under the hood and obtain intuition on how the machinery of international trade operates.

Our goal in exploring and visualizing bilateral trade data is to offer non-experts perspective on these matters in a digestible and pleasant way. 
No one in the team is an expert; therefore, our objective is to understand the broad strokes of how our world exchanged goods in the era of globalization without overstepping.

Here are some of the potential questions we want to provide visual intuition for: 
* Who has a surplus of food/energy and who needs to import it to survive?
* What are some "single points of failure" in terms of exports that, if disrupted, would change the way we live?
* How do events like wars or revolutions affect what countries import from and export to other countries?
* Does the shift of industry eastwards appear in export/import data? Intuitively, how large is it?
* Do landmark trade deals have a visible impact in trade activity?

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

#### EDA: Pre-processing

The data is already clean and easy to load and manipulate.
One challenge is that the dataset is quite large, owing mostly to the number of product categories (~5000).
The number of rows is in the order of num_years(28) x num_countries(238)^2 x categories(~5000).

We find that for the purposes of most of our analysis, this level of detail in category classification is unnecessary; for example we do not need to distinguish between pure-bred and non-pure bred horses (codes 010111 and 010119).

To this end, we use the built-in structure of the 6-digit HS92 product codes and aggregate based on the first two digits.
This yields 98 broader categories like "Meat and edible meat offal" or "Mineral fuels, mineral oils and products of their distillation" and reduces the size of the dataset by an order of magnitude.
This aggregation allows us to manipulate the data in an ordinary laptop.

#### EDA: Insights
Here is a quick enumeration of some initial findings:
* Total export tonnage increased from 7B Tons in 1995 to 15B Tons in 2023
* The largest export categories in USD are Electrical Machinery, Mineral Fuels, Mechanical Machinery, Vehicles, and Pharmaceutical Products (and, for example, not food).
* The three largest exporters are: China, the US, and Germany, totaling ~30% of total exports.
* The three largest importers are: the US, China, and Germany, totaling again ~30% of total imports.
* The US exports ~60% of the dollar amount it imports while China imports ~60% of the amount it exports.
* China exports almost 2x as much as the next largest exporter while it was not even in the top 3 in 1995.
* China exports ~35% of electrical machinery and ~60% of toys and games.
* When the war in Ukraine started, Ukrainian exports of Iron and Steel fell by ~50% compared to the average before the war.
* Russia's share of Mineral Fuel exports fell from ~10% in 2021 to ~7.5% in 2023.
* Syria's exports and imports fell by ~90% and ~70% after the beginning of the civil war in 2011 and did not recover at all by 2023.


### Related work
> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

#### Related work

Numerous institutions and organizations have analyzed international trade using datasets similar to CEPII’s BACI, such as the UN Comtrade database and World Bank trade reports. These studies provide broad economic insights, focusing on trade balances, global supply chains, and the effects of geopolitical shifts on commerce. The existing trade data visulizations include: The observatory of economic complexity, world trade oranization trade reports and international trade centre trade map, While these platforms provide valuable insights, they often focus on static trade statistics rather than exploring deeper patterns or historical shifts in globalization. Moreover, they may lack a user-friendly, interactive storytelling component to engage broader audiences beyond economists and policymakers.

Our project differentiates itself by:
* Bridging data with real-world events: Instead of merely presenting numbers, we aim to connect trade patterns with significant historical moments, such as trade agreements, financial crises, and supply chain disruptions.
* Identifying critical trade dependencies: By highlighting countries with dominant exports in key product categories, we examine potential risks in global supply chains and economic vulnerabilities.
* Using an interactive, storytelling-based approach: Inspired by data journalism from sources like The Financial Times, The New York Times, and Our World in Data, we focus on making trade data accessible to non-experts through engaging, visually intuitive presentations.

There are the source of inspiration.
* The Financial Times' Trade War Graphics: A visually rich explanation of trade conflicts and economic policies through interactive charts.
*  Our World in Data: A platform renowned for its clean, user-friendly approach to data-driven storytelling.
* The New York Times’ Supply Chain Crisis Report: A compelling visual narrative detailing global trade disruptions.

## Milestone 2 (18th April, 5pm)

**10% of the final grade**


## Milestone 3 (30th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone


# Running
Download data from https://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37

(select HS92 and put it in data/BACI_HS92_V202501)

pip install -r requirements.txt

## For jupyter

`cd src/eda`

Run `jupyter notebook`

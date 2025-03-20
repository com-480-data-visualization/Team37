# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Huiyun Zhu | |
| Konstantinos Prasopoulos | 285813 |
| Yuchen Qian | |

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
* Does the shif of industry eastwards appear in export/import data? Intuitively, how large is it?
* Do landmark trade deals have a visible impact in trade activity?

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

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

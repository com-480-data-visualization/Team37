## TODO:

* Data processing
   * We will need to be able to adjust for inflation ('value' is nominal dollars).
   * We will probably need GDP data to normalize trade (ie, how much of the economy is trade).  
   * Verify that values are in nominal USD.
   * CHECK: double accounting?

* Find Key political decisions that affected trade volumes (overall and in specific industries).

## Data source

https://www.cepii.fr/CEPII/en/bdd_modele/bdd_modele_item.asp?id=37

(HS92)

## Visualization ideas

* The prof's preference is to guide the viewer through a story. Ie, everything shown must be dense. Examples were:
   * A timeline of car fatalities annotated with relevant law-passing events.
   * A single page that shows a stacked area plot that shows how people spend their day, with options to filter by age and employment status.
   * For example: "who makes our food now, who did it in the past" 

* Map of the world with animated trade flows. One can select the year and commodity type, as well as source and destination. The idea is to vizualize how the world changed.
* Configurable Sankey-Diagrams to be able to answer questions like: who did Russia and the US sell weapons to from 1980 to 2000 and how much?
* What kind of products each country imports/exports -> what is the "fingerprint" of each country (personality).
* Trends over time per country.
* Visualize impact of policy (laws, agreements, presidents).

### After EDA
* Visualize the spread of industry/exports. How exports (ie surplus production) of eg machinery shifts around the globe.
* Visualize which countries are the most dependent on trade and could face most disruption if globalization recedes.

## Data processing (managing complexity)

* Aggregate by getting rid of small categories (ie, have an "other" group per country).
* Groupd categories together. There are 5000 categories but we are not interested in distinguising between pigs and goats.


## Milestone 2
* From 1995 to 2023, have countries become less food independant? 
* Example 1: there is a country that exports 2x more "food" than it imports -> export 20B import 10B -> The country is making more food than it needs by 10B
* Example 2: say another country imports 40B and exports 20B. It is consuming 20B more than it is producing.
* What happens if these countries go to war (for example)?
* Perhaps the world was more self-sufficient in terms of food in 1995 and is less so in 2023.
* How to visualize?
  * How many countries are net importers of food across time? -> Line plot. -> not interesting.
  * Just plot total food imports to understand how quickly it grew. -> Imports grew as fast as trade in general.
  * Need a sense of the total deficit and the total surplus. Is the surplus of surplus countries growing?
    * The quantity (weight) of food exports has increased by 2.6x - More population can This (likely) means that.
    * As a percent of GDP, Food trade has increases quite a bit (~50%). Goal is to make a compeling and intuitive visualization of this

* Percent of total deficit of top 5 countries
* focus on niche but extreme categories, eg toys.



FIRST PAGE - MAKE CLEAR THIS IS ONLY ABOUT GOODS - good site https://www.wto.org/english/res_e/statis_e/statistics2023_e.htm  (look at bottom) merchandise == physical goods
* Answers who makes more than they consume? Who the opposite? 
* Swipe right to see this over time. Also shows trade as % of GDP and tonnage. We can add a visualization for tonnage. - apparently, it is about 7 times the total number of active cars in the world.





## ANALOGY FOR TONNAGE OF TRADE
Let's break down the comparison step by step:

Estimate the Total Weight of All Cars:

There are roughly 1.4 billion cars in operation worldwide.

Assuming an average car weighs about 1.5 metric tons (this is a rough estimate; many passenger cars fall in the 1.2–2.0 metric ton range), the total weight is:

1.4
 billion
×
1.5
 metric tons
=
2.1
 billion metric tons
1.4 billion×1.5 metric tons=2.1 billion metric tons
Compare with 15.12 Billion Metric Tons:

The value you mentioned is 15.12 billion metric tons.

To see how many times heavier that is compared to all the cars, we divide:

15.12
 billion metric tons
2.1
 billion metric tons
≈
7.2
2.1 billion metric tons
15.12 billion metric tons
​
 ≈7.2
This means 15.12 billion metric tons is roughly 7 times the total weight of all active cars in the world (using our assumed average weight).




## Scratch
I have this dataframe that shows the trade deficit per country per year.

      year  country  value_trln_USD
0     1995        4       -0.000213
1     1995        8       -0.000602
2     1995       12       -0.000382
3     1995       20       -0.001006
4     1995       24        0.001942
...    ...      ...             ...
6451  2023      862       -0.002356
6452  2023      876       -0.000051
6453  2023      882       -0.000483
6454  2023      887       -0.010809
6455  2023      894        0.005213


What I want to do is eventually is to plot a stacked bar chart that can also go negative: For each year, the top 5 countries with the highest deficit in 2023 should appear as a stacked bar below the x axis, with the rest other than the N appearing as . In contrast, the top 5 
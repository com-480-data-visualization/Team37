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
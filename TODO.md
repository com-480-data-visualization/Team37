## TODO:

* Data processing
   * We will need to be able to adjust for inflation ('value' is nominal dollars).
   * We will probably need GDP data to normalize trade (ie, how much of the economy is trade).  
   * Verify that values are in nominal USD.

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

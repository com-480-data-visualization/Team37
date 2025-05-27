import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
OUTPUT_DIR = os.path.join(BASE_DIR, "web/public/data")
OUTPUT_DIR_INTERACTIVE = os.path.join(OUTPUT_DIR, "interactive")
DATA_DIR = os.path.join(PARENT_DIR, "data/BACI_HS92_V202501")
OTHER_DATA_DIR = os.path.join(PARENT_DIR, "data")
datayears = [str(y) for y in list(range(1995, 2024))]

datafile_prefix = "BACI_HS92_Y"
datafile_sufix = "_V202501.csv"
country_codes_file = "country_codes_V202501.csv"
product_codes_file = "product_codes_HS92_V202501.csv"
gdp_file = "world-gdp-nominal.csv"
cpi_file = "cpi.csv"
expanded_product_codes_file_22 = "harmonized-system_22.csv"

symbol_to_colname = {"t": "year", "i": "exporter", "j": "importer", "k": "product", "v": "value", "q": "quantity"}


# For the notebook
# datadir = "../../data/BACI_HS92_V202501"
# other_datadir = "../../data"

# Trade Specific
# Consider 01, 05, 
FOOD_CHAPTERS = ["02", "03", "04", "07", "08", "09", "10", "11", "12", "13", "14",
                "15", "16", "17", "18", "19", "20", "21"]

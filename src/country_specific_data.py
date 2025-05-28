from params import *
from util import *
from data_manip import *

def saudi_arabia(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    imports = data_df[data_df["importer"] == 682].copy()
    exports = data_df[data_df["exporter"] == 682].copy()


    # Output imports, exports, and balance for cereals
    cereal_imp = imports[imports["product_chapter"] == "10"]
    cereal_exp = exports[exports["product_chapter"] == "10"]
    cereal_imp = get_totals_per_chapter(cereal_imp)
    cereal_exp = get_totals_per_chapter(cereal_exp)
    to_csv = {"year": cereal_imp["year"],
              "imports_trln_USD": cereal_imp["value_trln_USD"],
              "imports_mln_metric_tons": cereal_imp["quantity_mln_metric_tons"],
              "exports_trln_USD": cereal_exp["value_trln_USD"],
              "exports_mln_metric_tons": cereal_exp["quantity_mln_metric_tons"],
              "balance_trln_USD": cereal_exp["value_trln_USD"] - cereal_imp["value_trln_USD"],
              "balance_mln_metric_tons": cereal_exp["quantity_mln_metric_tons"] - cereal_imp["quantity_mln_metric_tons"],
              }
    to_csv = pd.DataFrame(to_csv)
    save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_COUNTRY}/SAU/cereals.csv")

def yemen(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    imports = data_df[data_df["importer"] == 887].copy()
    exports = data_df[data_df["exporter"] == 887].copy()

    food_imports = get_chapter_totals_all_years(imports, cc_df, epc22_df, keep_top_n=10, merge_food=True)
    food_imports = food_imports[food_imports["product_chapter"] == "Food Related"]
    print(food_imports)

    yemen_gdp = load_csv_or_pickle(f"{CS_DATA_DIR}/gdp_nominal_yemen.csv")

    to_csv = pd.DataFrame({"year": food_imports["year"].reset_index(drop=True),
              "imports_pcnt_gdp": food_imports["value_trln_USD"].mul(1000).reset_index(drop=True) / yemen_gdp["nominal_gdp"].reset_index(drop=True)})
    save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_COUNTRY}/YEM/food_vs_gdp.csv")

def produce_country_specific_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    yemen(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    saudi_arabia(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)

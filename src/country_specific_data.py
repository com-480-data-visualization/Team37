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

def produce_country_specific_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    saudi_arabia(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)

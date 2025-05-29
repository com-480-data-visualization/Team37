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

    yemen_gdp = load_csv_or_pickle(f"{CS_DATA_DIR}/gdp_nominal_yemen.csv")

    to_csv = pd.DataFrame({"year": food_imports["year"].reset_index(drop=True),
              "imports_pcnt_gdp": food_imports["value_trln_USD"].mul(1000).reset_index(drop=True) / yemen_gdp["nominal_gdp"].reset_index(drop=True)})
    save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_COUNTRY}/YEM/food_vs_gdp.csv")

def ukraine(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    # Want a CSV with year,cereal_export_usd,cereal_export_tons,cereal_export_pcnt_total_usd,cereal_export_pcnt_total_tons
    exports = data_df[data_df["exporter"] == 804].copy()
    exports_sans_ukr = data_df[data_df["exporter"] != 804].copy()
    # Only keep Cereal
    exports = exports[exports["product_chapter"] == "10"]
    exports_sans_ukr = exports_sans_ukr[exports_sans_ukr["product_chapter"] == "10"]

    df_exp_yrly = exports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    df_exp_sans_yrly = exports_sans_ukr.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    ratio = df_exp_yrly.div(df_exp_sans_yrly)
    ratio.rename(columns={'value_trln_USD': 'ratio_total_exp_usd', 'quantity_mln_metric_tons': 'ratio_total_exp_weight'}, inplace=True)
    ratio = pd.concat([ratio, df_exp_yrly], axis=1)
    ratio.reset_index(inplace=True)
    save_dataframe_to_csv(ratio, f"{OUTPUT_DIR_COUNTRY}/UKR/cereal_exports.csv")

def usa(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    # Want a CSV with year,trade_balance_usd
    df = data_df.copy()
    df = df[df["product_chapter"] == "27"]  # fuels
    exports = df[df["exporter"] == 842]
    imports = df[df["importer"] == 842]  # USA
    total_exports = exports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    total_imports = imports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    total_exports.reset_index(inplace=True)
    total_imports.reset_index(inplace=True)
    to_csv = {"year": total_exports["year"],
              "imports_trln_USD": total_imports["value_trln_USD"],
              "imports_mln_metric_tons": total_imports["quantity_mln_metric_tons"],
              "exports_trln_USD": total_exports["value_trln_USD"],
              "exports_mln_metric_tons": total_exports["quantity_mln_metric_tons"],
              "balance_trln_USD": total_exports["value_trln_USD"] - total_imports["value_trln_USD"],
              "balance_mln_metric_tons": total_exports["quantity_mln_metric_tons"] - total_imports["quantity_mln_metric_tons"],
              }
    save_dataframe_to_csv(pd.DataFrame(to_csv), f"{OUTPUT_DIR_COUNTRY}/USA/fuel_trade.csv")

def iran(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    # Want a CSV with year,trade_balance_usd
    df = data_df.copy()
    df = df[df["product_chapter"] == "27"]  # fuels
    exports = df[df["exporter"] == 364]
    imports = df[df["importer"] == 364]  # Iran
    total_exports = exports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    total_imports = imports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    total_exports.reset_index(inplace=True)
    total_imports.reset_index(inplace=True)
    to_csv = {"year": total_exports["year"],
              "imports_trln_USD": total_imports["value_trln_USD"],
              "imports_mln_metric_tons": total_imports["quantity_mln_metric_tons"],
              "exports_trln_USD": total_exports["value_trln_USD"],
              "exports_mln_metric_tons": total_exports["quantity_mln_metric_tons"],
              "balance_trln_USD": total_exports["value_trln_USD"] - total_imports["value_trln_USD"],
              "balance_mln_metric_tons": total_exports["quantity_mln_metric_tons"] - total_imports["quantity_mln_metric_tons"],
              }
    save_dataframe_to_csv(pd.DataFrame(to_csv), f"{OUTPUT_DIR_COUNTRY}/IRN/fuel_trade.csv")

def china(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    # Want a CSV with year,trade_balance_usd,%of_total
    # And another with top import sources for 2023, ie country,import_amnount_usd,import_amount_weight

    # First timeseries CSV
    df = data_df.copy()
    df = df[df["product_chapter"] == "27"]  # fuels
    exports = df[df["exporter"] == 156]
    imports = df[df["importer"] == 156]  # China
    imports_sans_chn = df[df["importer"] != 156].copy()
    total_exports = exports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    total_imports = imports.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    total_imp_sans = imports_sans_chn.groupby(["year"]).agg({"value_trln_USD": "sum", "quantity_mln_metric_tons": "sum"})
    ratio = total_imports.div(total_imp_sans)
    total_exports.reset_index(inplace=True)
    total_imports.reset_index(inplace=True)
    total_imp_sans.reset_index(inplace=True)
    ratio.reset_index(inplace=True)
    to_csv = {"year": total_exports["year"],
              "imports_trln_USD": total_imports["value_trln_USD"],
              "imports_mln_metric_tons": total_imports["quantity_mln_metric_tons"],
              "exports_trln_USD": total_exports["value_trln_USD"],
              "exports_mln_metric_tons": total_exports["quantity_mln_metric_tons"],
              "balance_trln_USD": total_exports["value_trln_USD"] - total_imports["value_trln_USD"],
              "balance_mln_metric_tons": total_exports["quantity_mln_metric_tons"] - total_imports["quantity_mln_metric_tons"],
              "ratio_of_total_imports_usd": ratio["value_trln_USD"],
              "ratio_of_total_imports_weight": ratio["quantity_mln_metric_tons"],
              }
    save_dataframe_to_csv(pd.DataFrame(to_csv), f"{OUTPUT_DIR_COUNTRY}/CHN/fuel_trade.csv")
    
    topn = 10
    largest_sources = make_human_readable(imports.copy(), cc_df, epc22_df, country_fmt="country_iso3")
    largest_sources = get_top_partners(largest_sources, "exporter", year=2023, keep_top_n=topn)
    largest_sources.drop(columns=["product_chapter"], inplace=True)
    save_dataframe_to_csv(largest_sources, f"{OUTPUT_DIR_COUNTRY}/CHN/top{topn}_sources.csv")

    topn = 15
    largest_sources = make_human_readable(imports.copy(), cc_df, epc22_df, country_fmt="country_iso3")
    largest_sources = get_top_partners(largest_sources, "exporter", year=2023, keep_top_n=topn)
    largest_sources.drop(columns=["product_chapter"], inplace=True)
    save_dataframe_to_csv(largest_sources, f"{OUTPUT_DIR_COUNTRY}/CHN/top{topn}_sources.csv")


def produce_country_specific_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    china(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    usa(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    iran(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    ukraine(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    yemen(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    saudi_arabia(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)

    # Oil: USA (shale revolution - energy independence)
    # Iran: sanctions , exports close to 0 (shadow fleet?)
    # China: dependence? Massive growth? 20% of imports.
    
    # What vizualizations beyond timeseries with events?

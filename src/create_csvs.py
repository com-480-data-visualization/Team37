import os
from util import *
from data_manip import *
from params import *
from tqdm import tqdm
from country_specific_data import *

import os, pathlib, multiprocessing as mp
from functools import partial


# These will be populated once per process.
DATA_DF = EPC22_DF = CC_DF = None

def _init_worker(data_df, epc22_df, cc_df):
    global DATA_DF, EPC22_DF, CC_DF
    DATA_DF  = data_df
    EPC22_DF = epc22_df
    CC_DF    = cc_df

def _process_country(cc: str, keep_top_n: int, output_dir: str):
    """
    Exactly the inner logic you had, but using the worker-side globals
    instead of parameters.
    """
    data_df  = DATA_DF
    epc22_df = EPC22_DF
    cc_df    = CC_DF

    country_name = get_country_name(cc, cc_df, "country_iso3")

    # # Produce a (Year x Chapter  = 29 * 87 = 2523 rows) csv
    # cc_import_view, cc_export_view = get_imports_exports_for_country_per_year_chapter(data_df, cc)
    # cc_import_view.drop(columns=["quantity_mln_metric_tons"], inplace=True)
    # cc_export_view.drop(columns=["quantity_mln_metric_tons"], inplace=True)
    # cc_import_view.rename(columns={"value_trln_USD": "imports_trln_USD"}, inplace=True)
    # cc_export_view.rename(columns={"value_trln_USD": "exports_trln_USD"}, inplace=True)
    # to_csv = pd.concat([cc_import_view, cc_export_view], axis=1).reset_index(drop=True)

    # save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/surplus_deficit_by_chapter.csv")

    # # Produce the top N chapters in terms of imports and exports for each year:
    # # (29 * N) + 29 (other)  rows for each of the two CSVs
    # chapter_total_imports = get_totals_per_chapter(data_df[data_df["importer"] == cc])
    # chapter_total_exports = get_totals_per_chapter(data_df[data_df["exporter"] == cc])

    # to_csv = get_chapter_totals_all_years(chapter_total_imports, cc_df, epc22_df, keep_top_n)
    # save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_import_chapters.csv")

    # to_csv = get_chapter_totals_all_years(chapter_total_exports, cc_df, epc22_df, keep_top_n)
    # save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_export_chapters.csv")

    # Produce, for each year, the top N import sources for this country and the top 5 export destinations
    # for *each chapter*
    # N (countries) x 28 (yrs) x 87 (chapters) = 12k assuming N=5
    tmp_imp = make_human_readable(data_df[data_df["importer"] == cc].copy(),
                                  cc_df, epc22_df, country_fmt="country_iso3")
    tmp_exp = make_human_readable(data_df[data_df["exporter"] == cc].copy(),
                                  cc_df, epc22_df, country_fmt="country_iso3")

    largest_imports = get_top_partners_all_years(tmp_imp, actor="exporter",
                                                 keep_top_n=keep_top_n)
    # drop weight column to save space
    largest_imports.drop(columns=['quantity_mln_metric_tons'], inplace=True)
    save_dataframe_to_csv(largest_imports, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_import_srcs.csv")

    largest_exports = get_top_partners_all_years(tmp_exp, actor="importer",
                                                 keep_top_n=keep_top_n)
    largest_exports.drop(columns=['quantity_mln_metric_tons'], inplace=True)
    save_dataframe_to_csv(largest_exports, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_export_dsts.csv")


# ──────────────────────────────────────────────────────────────────────
# Public entry point (parallelised)
# ──────────────────────────────────────────────────────────────────────
def produce_interactive_map_csvs_parallel(
    data_df: pd.DataFrame,
    epc22_df: pd.DataFrame,
    pc_df: pd.DataFrame,
    cc_df: pd.DataFrame,
    gdp_df: pd.DataFrame,
    cpi_df: pd.DataFrame,
    keep_top_n: int = 5,
    n_processes: Optional[int] = None,
) -> None:
    """
    Parallel version: country loop is executed across *n_processes*
    (defaults to CPU count).  All CSVs land in `OUTPUT_DIR_INTERACTIVE/…`
    exactly as before.
    """
    n_processes = n_processes or mp.cpu_count()
    output_dir  = OUTPUT_DIR_INTERACTIVE

    # 0. product-chapter description mapping (one-off, parent only) ----
    product_chapters = data_df["product_chapter"].unique()
    prod_chap_df = (
        pd.Series(
            {pc: get_product_chapter_name(pc, epc22_df, "description")}
            for pc in product_chapters
        )
        .rename_axis("product_chapter")
        .reset_index()
    )
    save_dataframe_to_csv(prod_chap_df, f"{output_dir}/prod_chap_to_description.csv")

    # 1. countries list ------------------------------------------------
    country_codes = data_df["exporter"].unique().tolist()

    # 2. start the pool ------------------------------------------------
    with mp.Pool(
        processes=n_processes,
        initializer=_init_worker,
        initargs=(data_df, epc22_df, cc_df),
    ) as pool:
        work = partial(_process_country,
                       keep_top_n=keep_top_n,
                       output_dir=output_dir)

        # tqdm wrapper for progress bar
        list(tqdm(pool.imap_unordered(work, country_codes),
                  total=len(country_codes),
                  desc="Countries"))

def produce_interactive_map_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    country_codes = list(data_df["exporter"].unique())
    product_chapters = list(data_df["product_chapter"].unique())

    # First store all product_chapter codes -> chapter name in a CSV that is meant to be used by the
    # front end to do mappings. This will greatly reduce the size of the CSVs.
    prod_chap_names = {pc: get_product_chapter_name(pc, epc22_df, 'description') for pc in product_chapters}
    prod_chap_df = (
    pd.Series(prod_chap_names, name="description")   # mapping → Series
      .rename_axis("product_chapter")                # keys become index name
      .reset_index()                                 # back to two columns
)
    save_dataframe_to_csv(prod_chap_df, f"{OUTPUT_DIR_INTERACTIVE}/prod_chap_to_description.csv")


    # For each country
    print(f"Creating CSVs for each country for the interactive section")
    for cc in tqdm(country_codes):

        # Produce a (Year x Chapter  = 29 * 87 = 2523 rows) csv
        cc_import_view, cc_export_view = get_imports_exports_for_country_per_year_chapter(data_df, cc)
        cc_import_view.drop(columns=['quantity_mln_metric_tons'], inplace=True)
        cc_export_view.drop(columns=['quantity_mln_metric_tons'], inplace=True)
        cc_import_view.rename(columns={'value_trln_USD': 'imports_trln_USD'}, inplace=True)
        cc_export_view.rename(columns={'value_trln_USD': 'exports_trln_USD'}, inplace=True)

        to_csv = pd.concat([cc_import_view, cc_export_view], axis=1)

        to_csv.reset_index(inplace=True)

        country_name = get_country_name(cc, cc_df, 'country_iso3')
        save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/surplus_deficit_by_chapter.csv")

        # Produce the top N chapters in terms of imports and exports for each year:
        # (29 * N) + 29 (other)  rows for each of the two CSVs
        chapter_total_imports = get_totals_per_chapter(data_df[data_df["importer"] == cc])
        chapter_total_exports = get_totals_per_chapter(data_df[data_df["exporter"] == cc])
        keep_top_n = 5
        to_csv = get_chapter_totals_all_years(chapter_total_imports, cc_df, epc22_df, keep_top_n, merge_food=False)
        save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_import_chapters.csv")
        to_csv = get_chapter_totals_all_years(chapter_total_exports, cc_df, epc22_df, keep_top_n, merge_food=False)
        save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_export_chapters.csv")


        # # Produce, for each year, the top N import sources for this country and the top 5 export destinations
        # # for *each chapter*
        # # N (countries) x 28 (yrs) x 87 (chapters) = 12k assuming N=5
        # tmp_imp = make_human_readable(data_df[data_df["importer"] == cc].copy(), 
        #                               cc_df, epc22_df, 
        #                               country_fmt="country_iso3")
        # tmp_exp = make_human_readable(data_df[data_df["exporter"] == cc].copy(), 
        #                               cc_df, epc22_df, 
        #                               country_fmt="country_iso3")
        # keep_top_n = 5
        # largest_imports = get_top_partners_all_years(tmp_imp, actor="exporter", keep_top_n=keep_top_n)
        # save_dataframe_to_csv(largest_imports, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_import_srcs.csv")
        # largest_exports = get_top_partners_all_years(tmp_exp, actor="importer", keep_top_n=keep_top_n)
        # save_dataframe_to_csv(largest_exports, f"{OUTPUT_DIR_INTERACTIVE}/{country_name}/top_export_dsts.csv")



def produce_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df):
    # # Create Absulute $ deficit CSV
    # imports, exports, balance = get_totals_by_country(data_df)
    # to_csv = balance.copy()
    # to_csv["value_trln_USD"] = to_csv["value_trln_USD"].mul(1000.0).round(2)
    # to_csv.rename(columns={"value_trln_USD": "value_bln_USD"}, inplace=True)
    # save_dataframe_to_csv(make_human_readable(to_csv, cc_df, epc22_df, country_fmt="country_iso3"),
    #                        f"{OUTPUT_DIR}/absolute_deficit_all_years.csv")
    # year = 2023
    # save_dataframe_to_csv(make_human_readable(to_csv[to_csv["year"] == year], cc_df, epc22_df, country_fmt="country_iso3"),
    #                        f"{OUTPUT_DIR}/absolute_deficit_{year}.csv")
    
    # # Create absolute balance for food related products
    # food_imports, food_exports, food_balance = get_food_totals_by_country(data_df)
    # to_csv = food_balance.copy()
    # to_csv["value_trln_USD"] = to_csv["value_trln_USD"].mul(1000.0).round(2)
    # to_csv.rename(columns={"value_trln_USD": "value_bln_USD"}, inplace=True)
    # save_dataframe_to_csv(make_human_readable(to_csv[to_csv["year"] == year], cc_df, epc22_df, country_fmt="country_iso3"),
    #                        f"{OUTPUT_DIR}/absolute_food_deficit_{year}.csv")


    # # Create overal $ trade volume CSV - tonnage, inflation-adjusted and as % of GDP

    # # deflgdp_df = adjust_for_inflation(gdp_df, cpi_df, 2023)  # TODO: this deflation of world GDP vs US CPI yields some funny real values.
    
    # # Work only with trade vs GDP for now.
    # total_trade = get_total_trade(data_df)
    
    # total_trade_norm_gdp = pd.DataFrame()
    # total_trade_norm_gdp["trade_pcn_gdp"] = total_trade.set_index("year")["value_trln_USD"].divide(gdp_df.set_index("year")["world_nominal_gdp"], axis=0).mul(100.0)
    # save_dataframe_to_csv(total_trade_norm_gdp, f"{OUTPUT_DIR}/goods_trade_as_pcnt_gdp.csv", index=True)

    # # Create CSV with tonage by year
    # to_csv = total_trade[["year", "quantity_mln_metric_tons"]].copy()
    # to_csv["quantity_mln_metric_tons"] = to_csv["quantity_mln_metric_tons"].div(1000.0).round(2)
    # save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR}/goods_trade_tonnage.csv")


    # # # Create surplus countries csv and deficit countries CSV (year, USA, X, Y, other)
    # # # TODO: for now, this is referencd in 2023, ie, countries are considered surplus or deficit based on 2023.
    # # # This makes the "others" aggregation a bit pointless. 
    # # surplus, deficit = get_total_trade(make_human_readable(balance.copy(), cc_df, epc22_df, country_fmt="country_iso3"))
    # # save_dataframe_to_csv(surplus, f"{OUTPUT_DIR}/top_surplus_countries_pcnt.csv")
    # # save_dataframe_to_csv(deficit, f"{OUTPUT_DIR}/top_deficit_countries_pcnt.csv")

    # chapter_totals = get_totals_per_chapter(data_df)
    # save_dataframe_to_csv(make_human_readable(chapter_totals, cc_df, epc22_df, product_fmt="description"),
    #                        f"{OUTPUT_DIR}/chapter_totals.csv")
    
    # year = 2023
    # keep_top_n = 20
    # to_csv = get_chapter_totals_for_year(chapter_totals, cc_df, epc22_df, year, keep_top_n)
    # save_dataframe_to_csv(to_csv, f"{OUTPUT_DIR}/chapter_totals_{year}.csv")

    # produce_interactive_map_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)
    # produce_interactive_map_csvs_parallel(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df, n_processes=6)


    produce_country_specific_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)


if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    print("=============================================")
    print(" Starting CSV Generation Process           ")
    print(f" Output Directory: {os.path.abspath(OUTPUT_DIR)}")
    print("=============================================")

    # Create the main output directory if it doesn't exist
    try:
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        print(f"Ensured output directory exists: '{OUTPUT_DIR}'")
    except OSError as e:
        print(f"FATAL: Could not create base output directory '{OUTPUT_DIR}': {e}")
        exit(1) # Stop execution if we can't create the main directory

    data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df = util.load_all_data()
    data_df = standard_unit_and_name_conversions(data_df)
    # Set gdp to trillions
    gdp_df["world_nominal_gdp"] = gdp_df["world_nominal_gdp"].div(1000.0)

    #### PRODUCE CSVs ####
    produce_csvs(data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df)

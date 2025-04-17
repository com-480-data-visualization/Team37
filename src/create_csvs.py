import os
from util import *
from params import *



def get_totals_by_country(in_df: pd.DataFrame):
    df = in_df.copy()
    # Calculate, for each country, total exports and imports separately.
    imp = df.groupby(["year", "importer"]).agg({'value_trln_USD': 'sum', 'quantity_mln_metric_tons':'sum'})
    exp = df.groupby(["year", "exporter"]).agg({'value_trln_USD': 'sum', 'quantity_mln_metric_tons':'sum'})
    imp.index.rename("country", level="importer", inplace=True)
    exp.index.rename("country", level="exporter", inplace=True)
    balance = exp - imp
    return exp.reset_index(), imp.reset_index(), balance.reset_index()

def get_total_trade(in_df: pd.DataFrame):
    df = in_df.copy()
    return df.groupby(["year"]).agg({'value_trln_USD': 'sum', 'quantity_mln_metric_tons':'sum'}).reset_index()

def get_top_deficit_surplus_countries(in_df: pd.DataFrame, ref_year=2023, keep_n=5):
    df = in_df.copy()
    # Pivot, make each country a column
    df = df.pivot(index='year', columns='country', values='value_trln_USD')
    df.reset_index(inplace=True)
    # Find top deficit and surplus countries on ref year
    all_balances_ref_year = df[df["year"] == ref_year].max()
    top_surplus = list(all_balances_ref_year.sort_values(ascending=False).iloc[1:keep_n+1].index)
    top_deficit = list(all_balances_ref_year.sort_values(ascending=True).iloc[0:keep_n].index)

    # find surplus countries in ref_year
    # TODO: problem here is that a surplus country in 2023 may be a deficit one in 2022.
    # Can address by separately finding surplus and deficiti countries per year?
    # Probably a good viz is to show a stacked barchart with surplus at the top and deficit at the bottom.

    # Better yet: don't show rest at all: instead show top_n divided by total deficit/surplus.
    # "How much of the deficit is undertaken by the top 5 countries?"
    # surplus_countries = list(all_balances_ref_year[all_balances_ref_year > 0].iloc[1:].index)
    # deficit_countries = list(all_balances_ref_year[all_balances_ref_year < 0].index)

    # rest_surplus_countries = list(set(surplus_countries) - set(top_surplus))
    # rest_deficit_countries = list(set(deficit_countries) - set(top_deficit))

    # surplus = df[["year"] + surplus_countries].copy()
    # deficit = df[["year"] + deficit_countries].copy()

    # # Sum the "others" that are not in the keep_n
    # surplus["other_surplus"] = surplus[rest_surplus_countries].sum(axis=1)
    # surplus.drop(columns=rest_surplus_countries, inplace=True)
    # deficit["other_deficit"] = deficit[rest_deficit_countries].sum(axis=1)
    # deficit.drop(columns=rest_deficit_countries, inplace=True)

    surplus = df[["year"] + top_surplus].copy()
    deficit = df[["year"] + top_deficit].copy()

    # Calculate total deficit and surplus per year
    total_surplus = df.iloc[:,1:].where(df >= 0, 0).sum(axis=1)
    total_deficit = df.iloc[:,1:].where(df < 0, 0).sum(axis=1)


    surplus.iloc[:,1:] = surplus.iloc[:,1:].divide(total_surplus, axis=0).mul(100.0)
    deficit.iloc[:,1:] = deficit.iloc[:,1:].divide(total_deficit, axis=0).mul(100.0)


    return surplus, deficit



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


    # Create Absulute $ deficit CSV
    imports, exports, balance = get_totals_by_country(data_df)
    to_csv = balance.copy()
    to_csv["value_trln_USD"] = to_csv["value_trln_USD"].mul(1000.0).round(2)
    to_csv.rename(columns={"value_trln_USD": "value_bln_USD"}, inplace=True)
    save_dataframe_to_csv(make_human_readable(to_csv, cc_df, epc22_df, country_fmt="country_iso3"),
                           f"{OUTPUT_DIR}/absolute_deficit_all_years.csv")
    year = 2023
    save_dataframe_to_csv(make_human_readable(to_csv[to_csv["year"] == year], cc_df, epc22_df, country_fmt="country_iso3"),
                           f"{OUTPUT_DIR}/absolute_deficit_{year}.csv")
    
    # Create overal $ trade volume CSV - tonnage, inflation-adjusted and as % of GDP

    deflgdp_df = adjust_for_inflation(gdp_df, cpi_df, 2023)  # TODO: this deflation of world GDP vs US CPI yields some funny real values.
    
    # Work only with trade vs GDP for now.
    total_trade = get_total_trade(data_df)
    
    total_trade_norm_gdp = pd.DataFrame()
    total_trade_norm_gdp["trade_pcn_gdp"] = total_trade.set_index("year")["value_trln_USD"].divide(gdp_df.set_index("year")["world_nominal_gdp"], axis=0).mul(100.0)
    save_dataframe_to_csv(total_trade_norm_gdp, f"{OUTPUT_DIR}/goods_trade_as_pcnt_gdp.csv", index=True)

    # Create CSV with tonage by year
    save_dataframe_to_csv(total_trade[["year", "quantity_mln_metric_tons"]], f"{OUTPUT_DIR}/goods_trade_tonnage.csv")


    # Create surplus countries csv and deficit countries CSV (year, USA, X, Y, other)
    
    # TODO: for now, this is referencd in 2023, ie, countries are considered surplus or deficit based on 2023.
    # This makes the "others" aggregation a bit pointless. 
    surplus, deficit = get_top_deficit_surplus_countries(make_human_readable(balance, cc_df, epc22_df, country_fmt="country_iso3"))
    save_dataframe_to_csv(surplus, f"{OUTPUT_DIR}/top_surplus_countries_pcnt.csv")
    save_dataframe_to_csv(deficit, f"{OUTPUT_DIR}/top_deficit_countries_pcnt.csv")

    # Create CSV that shows skewed industries in 2023

import os
from util import *
from params import *



def get_totals_by_country(in_df: pd.DataFrame, year: int):

    df = in_df.copy()
    df = df[df["year"] == year]

    # Calculate, for each country, total exports and imports separately.
    imp = df.groupby(["importer"]).agg({'value_trln_USD': 'sum', 'quantity_mln_metric_tons':'sum'})
    exp = df.groupby(["exporter"]).agg({'value_trln_USD': 'sum', 'quantity_mln_metric_tons':'sum'})
    balance = exp - imp
    print(imp)
    print(exp)
    print(balance)

    return exp.reset_index(), imp.reset_index(), balance.reset_index()





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


    data_df, epc22_df, pc_df, cc_df = util.load_all_data()
    data_df = standard_unit_and_name_conversions(data_df)

    imports, exports, balance = get_totals_by_country(data_df, 2023)
    print(balance)
    save_dataframe_to_csv(make_human_readable(balance, cc_df, epc22_df, country_fmt="country_iso3"),
                           f"{OUTPUT_DIR}/absolute_deficit.csv")

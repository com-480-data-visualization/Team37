import os
from util import *
from params import *



def create_deficit_csv(in_df):
    df = in_df.copy()
    df = standard_unit_and_name_conversions(df)
    print(df)


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


    create_deficit_csv(data_df)

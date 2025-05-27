import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np
import os

from params import *
import util

mpl.rcParams.update({
    'font.size': 14,            # general font size
    'axes.titlesize': 16,       # title font size
    'axes.labelsize': 16,       # x and y label font size
    'xtick.labelsize': 14,      # x tick label font size
    'ytick.labelsize': 14,      # y tick label font size
    'legend.fontsize': 14,      # legend font size
    'figure.titlesize': 20      # figure title font size
})

def load_csv_or_pickle(file_path, pickle_suffix=".pkl"):
    # Create the pickle file name by replacing the extension (or appending if no extension found)
    base, ext = os.path.splitext(file_path)
    pickle_path = base + pickle_suffix
    df = pd.DataFrame()

    if os.path.exists(pickle_path):
        print(f"Loading pickle: {pickle_path}")
        df = pd.read_pickle(pickle_path)
    elif os.path.exists(file_path):
        print(f"Loading CSV: {file_path}")
        df = util.load_csv_file(file_path)
        # Save the DataFrame to a pickle for future use
        df.to_pickle(pickle_path)
    return df


def load_all_data():
    # Load country codes
    cc_df = load_csv_or_pickle(f"{DATA_DIR}/{country_codes_file}")
    assert(not cc_df.empty)

    # Load product codes
    pc_df = load_csv_or_pickle(f"{DATA_DIR}/{product_codes_file}")
    assert(not pc_df.empty)

    # Load expanded product codes, then filter and select columns
    epc22_df = load_csv_or_pickle(f"{OTHER_DATA_DIR}/{expanded_product_codes_file_22}")
    epc22_df = epc22_df[epc22_df["hscode"].str.len() == 2]
    epc22_df = epc22_df[['section', 'hscode', 'description']]
    assert(not epc22_df.empty)

    # Main dataset: aggregate data from multiple years.

    # Try loading the pre-aggregated pickle first.
    all_data_name = "BACI_HS92_all.pkl"
    data_df = pd.DataFrame()
    data_df = load_csv_or_pickle(f"{DATA_DIR}/{all_data_name}")
    if (data_df.empty):
        for year in datayears:
            # Load CSV (or pickle) for the given year
            file_name = f"{DATA_DIR}/{datafile_prefix}{year}{datafile_sufix}"
            df = load_csv_or_pickle(file_name)
            assert(not df.empty)

            # Rename columns and merge all data into a single DataFrame
            df.rename(columns=symbol_to_colname, inplace=True)
            df['product'] = df['product'].astype(str)
            
            # Optimization: aggregate by product section before concatenating.
            # This merges similar products (same first 2 digits), reducing the number of rows.
            df = util.aggregate_across_sections(df)
            data_df = pd.concat([data_df, df])
    
        data_df.reset_index(inplace=True)
        print(f"Storing all years pickle as {all_data_name}")
        data_df.to_pickle(f"{DATA_DIR}/{all_data_name}")
    else:
        print(f"Found all_data pickle")

    # Load global nominal gdp
    gdp_df = load_csv_or_pickle(f"{OTHER_DATA_DIR}/{gdp_file}")
    assert(not gdp_df.empty)

    # Load US cpi data
    cpi_df = load_csv_or_pickle(f"{OTHER_DATA_DIR}/{cpi_file}")
    assert(not gdp_df.empty)

    return data_df, epc22_df, pc_df, cc_df, gdp_df, cpi_df


def load_csv_file(file_path):
    """
    Load a CSV file into a pandas DataFrame.

    Args:
        file_path (str): The path to the CSV file.

    Returns:
        pd.DataFrame: The loaded data as a DataFrame, or None if an error occurs.
    """
    try:
        df = pd.read_csv(file_path)
        print(f"CSV file loaded successfully with {len(df)} records.")
        return df
    except Exception as e:
        print("An error occurred while loading the CSV file:", e)
        return None


def save_dataframe_to_csv(dataframe, file_path, index=False, encoding='utf-8', float_format="%.8f"):
    """
    Save a pandas DataFrame to a CSV file with float numbers formatted in fixed-point notation.
    
    Args:
        dataframe (pd.DataFrame): The pandas DataFrame to save.
        file_path (str): The path where the CSV file will be saved.
                         If the directory doesn't exist, it will be created.
        index (bool, optional): Whether to write the DataFrame's index as a column.
                                Defaults to False.
        encoding (str, optional): The encoding to use for the output file.
                                  Defaults to 'utf-8'.
        float_format (str, optional): Format string for floating point numbers.
                                      Defaults to '%.4f', which formats floats to four decimal places.
    
    Returns:
        bool: True if the DataFrame was saved successfully, False otherwise.
    """
    # Basic check to ensure the input is a DataFrame
    if not isinstance(dataframe, pd.DataFrame):
        print("Error: The provided 'dataframe' object is not a pandas DataFrame.")
        return False
    
    if not file_path or not isinstance(file_path, str):
        print(f"Error: Invalid file_path {file_path} provided.")
        return False

    try:
        # Ensure the directory for the file exists, create it if not
        output_dir = os.path.dirname(file_path)
        if output_dir:  # Only create directories if the path includes them
            os.makedirs(output_dir, exist_ok=True)
            # print(f"Ensured directory exists: {output_dir}")

        # Save the DataFrame to CSV with the specified float format
        # print(f"Attempting to save DataFrame with {len(dataframe)} records to {file_path}...")
        dataframe.to_csv(file_path, index=index, encoding=encoding, float_format=float_format)
        # print(f"DataFrame successfully saved to {file_path}")
        return True
    except IOError as e:
        print(f"An IOError occurred while saving the CSV file to {file_path}: {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occurred while saving the DataFrame to CSV: {e}")
        return False


def aggregate_across_sections(data_df_with_section_col: pd.DataFrame):
    df = data_df_with_section_col
    df["product_chapter"] = df['product'].str[:2].astype('string')
    df = df.groupby(["year", "exporter", "importer", "product_chapter"]).agg({'value': 'sum', 'quantity':'sum'})
    return df


def plot_lines(df, xcol, ycols, xtitle=None, ytitle=None, title=None, ymin=None, 
               ymax=None, figsize=(8, 5), stacked=False, stack_norm=False, legend_ncols=1,
               normalize_to_xpoint=None, legend_out=False):
    """
    Plots a basic line chart or a stacked area plot from a pandas DataFrame.
    
    Parameters:
        df (pd.DataFrame): The source dataframe.
        xcol (str): The column name for the x-axis values.
        ycols (list or str): A list of column names (or a single column name) for the y-axis.
                             Each y-column will be plotted as a separate line or stacked area.
        xtitle (str, optional): Label for the x-axis. Defaults to None.
        ytitle (str, optional): Label for the y-axis. Defaults to None.
        title (str, optional): Plot title. Defaults to None.
        ymin (float, optional): Minimum limit for y-axis. Defaults to None.
        ymax (float, optional): Maximum limit for y-axis. Defaults to None.
        figsize (tuple, optional): Figure size. Defaults to (8, 5).
        stacked (bool, optional): If True, creates a stacked plot instead of separate lines.
        stack_norm (bool, optional): If True (and stacked is True), normalize each x tick to sum to 100.
        legend_ncols (int, optional): Number of columns for the legend. Defaults to 1.
        normalize_to_xpoint (scalar, optional): The x-axis value to use for normalization.
            Each timeseries is normalized by dividing by its value at the given x value.
        legend_out (bool, optional): If True, places the legend completely out of the plot to the right.
    
    Usage:
        plot_lines(df, 'year', ['sales', 'profit'], xtitle='Year', ytitle='Amount',
                   title='Sales and Profit over Years', stacked=True, stack_norm=True, 
                   legend_ncols=2, normalize_to_xpoint=2000, legend_out=True)
    """
    import matplotlib.pyplot as plt
    import numpy as np

    # Ensure ycols is a list
    if isinstance(ycols, str):
        ycols = [ycols]
    
    # Create a copy of the dataframe to avoid modifying the original
    df_plot = df.copy()

    # Apply normalization if requested
    if normalize_to_xpoint is not None:
        for col in ycols:
            matching_rows = df_plot[df_plot[xcol] == normalize_to_xpoint]
            if matching_rows.empty:
                raise ValueError(f"No matching x value equal to {normalize_to_xpoint} for normalization in column '{col}'")
            normalization_value = matching_rows.iloc[0][col]
            if normalization_value == 0:
                raise ValueError(f"Normalization factor is zero for column '{col}' at x value {normalize_to_xpoint}")
            df_plot[col] = df_plot[col] / normalization_value
    
    # Process labels: truncate to at most 20 characters (adding ".." if truncated)
    labels = [label[:25] + (".." if len(label) > 25 else "") for label in ycols]
    
    plt.figure(figsize=figsize)
    
    if stacked:
        # Extract x values and y values from the modified dataframe
        x = df_plot[xcol].values
        y_vals = [df_plot[col].values for col in ycols]
        
        if stack_norm:
            totals = np.sum(y_vals, axis=0)
            totals[totals == 0] = 1  # Avoid division by zero
            y_vals = [(y / totals) * 100 for y in y_vals]
        
        plt.stackplot(x, *y_vals, labels=labels)
        
        if len(ycols) > 1:
            handles, labs = plt.gca().get_legend_handles_labels()
            if legend_out:
                plt.legend(handles[::-1], labs[::-1], loc='center left', 
                           bbox_to_anchor=(1, 0.5), ncol=legend_ncols)
            else:
                plt.legend(handles[::-1], labs[::-1], loc='upper left', ncol=legend_ncols)
    else:
        # Plot each timeseries as a separate line
        for col, lab in zip(ycols, labels):
            plt.plot(df_plot[xcol], df_plot[col], marker='o', label=lab)
        
        if len(ycols) > 1:
            if legend_out:
                plt.legend(loc='center left', bbox_to_anchor=(1, 0.5), ncol=legend_ncols)
            else:
                plt.legend(loc='upper left', ncol=legend_ncols)
    
    if xtitle:
        plt.xlabel(xtitle)
    if ytitle:
        plt.ylabel(ytitle)
    if title:
        plt.title(title)
    
    if ymin is not None or ymax is not None:
        plt.ylim(bottom=ymin, top=ymax)
    
    # Adjust layout to make room for the legend if it's outside the plot
    if legend_out:
        plt.tight_layout(rect=[0, 0, 0.8, 1])
    else:
        plt.tight_layout()
    
    plt.grid(True)
    plt.show()

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib as mpl
mpl.rcParams.update({
    'font.size': 14,            # general font size
    'axes.titlesize': 16,       # title font size
    'axes.labelsize': 16,       # x and y label font size
    'xtick.labelsize': 14,      # x tick label font size
    'ytick.labelsize': 14,      # y tick label font size
    'legend.fontsize': 14,      # legend font size
    'figure.titlesize': 20      # figure title font size
})

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

def aggregate_across_sections(data_df_with_section_col: pd.DataFrame):
    df = data_df_with_section_col
    df["product_chapter"] = df['product'].str[:2]
    df = df.groupby(["year", "exporter", "importer", "product_chapter"]).agg({'value': 'sum', 'quantity':'sum'})
    return df


def plot_lines(df, xcol, ycols, xtitle=None, ytitle=None, title=None, ymin=None, 
               ymax=None, figsize=(8, 5), stacked=False, stack_norm=False):
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
    
    Usage in a Jupyter Notebook:
        plot_lines(df, 'year', ['sales', 'profit'], xtitle='Year', ytitle='Amount',
                   title='Sales and Profit over Years', stacked=True, stack_norm=True)
    """
    # Ensure ycols is a list
    if isinstance(ycols, str):
        ycols = [ycols]
    
    # Process labels: convert to string and truncate to at most 20 characters
    labels = [f"{str(label)[:20]}.." for label in ycols]
    
    plt.figure(figsize=figsize)
    
    if stacked:
        # Get x values and y values as arrays
        x = df[xcol].values
        y_vals = [df[col].values for col in ycols]
        
        if stack_norm:
            # Compute totals per x tick
            totals = np.sum(y_vals, axis=0)
            # Avoid division by zero: set zero totals to 1
            totals[totals == 0] = 1
            # Normalize each series to sum to 100 at each x tick
            y_vals = [(y / totals) * 100 for y in y_vals]
        
        # Create the stackplot with processed labels
        plt.stackplot(x, *y_vals, labels=labels)
        
        # Reverse the legend entries so the top area is listed last
        if len(ycols) > 1:
            handles, labs = plt.gca().get_legend_handles_labels()
            plt.legend(handles[::-1], labs[::-1], loc='upper left')
    else:
        # Plot separate line charts using the processed labels
        for col, lab in zip(ycols, labels):
            plt.plot(df[xcol], df[col], marker='o', label=lab)
        
        if len(ycols) > 1:
            plt.legend(loc='upper left')
    
    if xtitle:
        plt.xlabel(xtitle)
    if ytitle:
        plt.ylabel(ytitle)
    if title:
        plt.title(title)
    
    # Set y-axis limits if provided
    if ymin is not None or ymax is not None:
        plt.ylim(bottom=ymin, top=ymax)
    
    plt.tight_layout()
    plt.grid(True)
    plt.show()

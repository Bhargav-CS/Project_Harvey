import pandas as pd

# Step 2: Read the Parquet file into a DataFrame
df = pd.read_parquet('data1.parquet')

# Step 3: Convert the DataFrame to CSV
df.to_csv('output_file.csv', index=False)

# Step 3: Convert the DataFrame to JSON (optional)
# df.to_json('output_file.json', orient='records', lines=True)
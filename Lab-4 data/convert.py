import pandas as pd
df = pd.read_csv (r'CAvideos.csv')
df.to_json (r'CAvideos.json')
import pandas as pd
import os

f = open("assets/js/data.js", "w")
df = pd.read_csv("data/raw_data.csv")
df = df.set_axis(['Date', 'Price', 'Open', 'High', 'Low', 'Volume', 'Change'], axis=1)
df = df[::-1].reset_index(drop=True)
data = df.to_json()
print(data)
f.write(f"data = {data}")
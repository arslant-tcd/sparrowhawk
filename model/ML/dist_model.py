# -*- coding: utf-8 -*-
"""
Created on Tue Mar 29 10:40:53 2022

@author: shriy
"""

import pandas as pd

data = pd.read_csv("data.csv")
#print(data.head())

song_id = "7xPhfUan2yNtyFG0cUWkt8"
print(data.loc[data["id"]==song_id]['name'])

d1 = data.loc[data["id"]==song_id]
rec_data = data.loc[data["id"]!=song_id]
rec_data['diff']=0

for col in rec_data:
    if(rec_data[col].dtypes=="int64" or rec_data[col].dtypes=="float64")and col!='diff':
        rec_data[col] = rec_data[col].sub(d1[col], fill_value=999)
        rec_data['diff']+=(rec_data[col]**2)

rec_data['diff']=rec_data['diff']**1/2

rec_data.sort_values(by=["diff"])
result = rec_data.head()

print(result['name'])
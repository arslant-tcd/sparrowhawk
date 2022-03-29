# -*- coding: utf-8 -*-
"""
Created on Tue Mar 29 08:49:13 2022

@author: shriy
"""
from data.getData import GetMusic

from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd

class Knn:

    def run(self):
        #importing data from csv file
        music=GetMusic()
        input_data=music.get()

        print(input_data)
        
        df = input_data
        df_num = df.select_dtypes(include=[np.number])

        print(df_num.columns)

        kmeans_model = KMeans(20,init='k-means++')
        kmeans_model.fit(df_num)

        df_num['Cluster'] = kmeans_model.labels_

        df_num.head()

        song_id = "7xPhfUan2yNtyFG0cUWkt8"
        #["7xPhfUan2yNtyFG0cUWkt8","4BZXVFYCb76Q0Klojq4piV"]
        d1 = df.loc[df["id"]==song_id]
        d1_num = d1.select_dtypes(include=[np.number])

        #result = kmeans_model.fit_predict(d1_num)
        cluster_pts = kmeans_model.cluster_centers_
        cluster_pts.shape

        distances = []
        for center in cluster_pts:
            distances.append(np.sum((d1_num - center) ** 2))                
        distances = np.reshape(distances, cluster_pts.shape)

        dist = distances.sum(axis=1)
        print(dist)

        closest_centroid = np.argmin(dist)
        print("Cluster is ",closest_centroid)

        #print(df_num.loc[df_num["Cluster"]==closest_centroid].sample(5))

        df['Cluster'] = kmeans_model.labels_
        print(df.loc[df["Cluster"]==closest_centroid].sample(5))
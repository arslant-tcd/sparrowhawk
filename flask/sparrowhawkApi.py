from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import cross_origin
import pickle
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd


app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'sparrowhawk'
app.config['MONGO_URI'] = 'mongodb+srv://dbUser:sparrowhawk@tcd.1rssu.mongodb.net/sparrowhawk?retryWrites=true&w=majority'

mongo = PyMongo(app)

@app.route('/users', methods=['GET'])
def getUsers():
    user = mongo.db.user
    op = []

    for u in user.find():
        print(u)
        op.append({'email' : u['mail']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/addUser', methods=['POST'])
@cross_origin()
def addUsers():
    user = mongo.db.user
    content = request.get_json(force=True)
    print(content)
    id = user.insert_one({'mail':content['email']})
    
    return jsonify({'email' : content['email']})
    

@app.route('/getDataByArtist', methods=['GET'])
def getDataByArtist():
    user = mongo.db.dataByArtist
    op = []

    for data in user.find():
        
        op.append({'mode': data['mode'],'count': data['count'],'acousticness': data['acousticness'],'artists': data['artists'],'danceability': data['danceability'],'duration_ms': data['duration_ms'],'energy': data['energy'],'instrumentalness': data['instrumentalness'],'liveness': data['liveness'],'loudness': data['loudness'],'speechiness': data['speechiness'],'tempo': data['tempo'],'valence': data['valence'],'popularity': data['popularity'],'key': data['key']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/getDataByGenres', methods=['GET'])
def getDataByGenres():
    user = mongo.db.dataByGenres
    op = []

    for data in user.find():
        
        op.append({'mode':data['mode'],'genres':data['genres'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/getDataByYear', methods=['GET'])
def getDataByYear():
    user = mongo.db.dataByYear
    op = []

    for data in user.find():
        
        op.append({'mode':data['mode'],'year':data['year'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/getDataWGenre', methods=['GET'])
def getDataWGenre():
    user = mongo.db.dataWGenres
    op = []

    for data in user.find():
        
        op.append({'genres':data['genres'],'artists':data['artists'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key'],'mode':data['mode'],'count':data['count']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/getMusic', methods=['GET'])
def getMusic():
    user = mongo.db.music
    op = []

    for data in user.find():
        
        op.append({'valence':data['valence'],'year':data['year'],'acousticness':data['acousticness'],'artists':data['artists'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'explicit':data['explicit'],'id':data['id'],'instrumentalness':data['instrumentalness'],'key':data['key'],'liveness':data['liveness'],'loudness':data['loudness'],'mode':data['mode'],'name':data['name'],'popularity':data['popularity'],'release_date':data['release_date'],'speechiness':data['speechiness'],'tempo':data['tempo']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/getYears', methods=['GET'])
def getYears():
    user = mongo.db.music
    op = []

    for data in user.distinct("year"):
        print(data)
        # op.append({'valence':data['valence'],'year':data['year'],'acousticness':data['acousticness'],'artists':data['artists'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'explicit':data['explicit'],'id':data['id'],'instrumentalness':data['instrumentalness'],'key':data['key'],'liveness':data['liveness'],'loudness':data['loudness'],'mode':data['mode'],'name':data['name'],'popularity':data['popularity'],'release_date':data['release_date'],'speechiness':data['speechiness'],'tempo':data['tempo']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/recommend/<id>', methods=['GET'])
@cross_origin()
def recommend(id):
    # content = request.get_json(force=True)
    print(content['id'])
    op = predict(id)
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/getFormSuggestions', methods=['GET'])
# @cross_origin()
def getFormSuggestions():
    op ={}
    df = pd.read_csv('test.csv')    
    cj = df.sample(n = 6)
    op['songs']=cj[['id','name']].to_dict()
    print(op)
    cj = df.sample(n = 6)
    artists =[]
    for i in cj['artists']:
        tmp = i.replace("\'", "$")
        artists.append(tmp.split('$')[1])
        # print(tmp.split('$'))
        # print(list(i)[0])
    # print(artists)
    op['artists'] = artists
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response



def predict(id):
        #importing data from csv file
        # music=GetMusic()
        # input_data=music.get()

        # df = input_data
        # df.to_csv('test.csv')
        df = pd.read_csv('test.csv')
        num_cols = ['valence','year','acousticness','danceability','duration_ms','energy','explicit','instrumentalness','key','liveness','loudness','mode','popularity','speechiness','tempo']
        df[num_cols] =df[num_cols].apply(pd.to_numeric)
        df_num = df.select_dtypes(include=[np.number])

        # print(df_num.columns)

        # kmeans_model = KMeans(20,init='k-means++')
        # kmeans_model.fit(df_num)
        with open('model_pickle','rb') as f:
            kmeans_model = pickle.load(f)

        df_num['Cluster'] = kmeans_model.labels_

        df_num.head()

        # song_id = "7xPhfUan2yNtyFG0cUWkt8"
        #["7xPhfUan2yNtyFG0cUWkt8","4BZXVFYCb76Q0Klojq4piV"]
        d1 = df.loc[df["id"]==id]
        d1_num = d1.select_dtypes(include=[np.number])
        d1_num = d1_num.loc[:, ~d1_num.columns.str.contains('^Unnamed')]
        # print(d1_num[0][1:])
        #result = kmeans_model.fit_predict(d1_num)
        cluster_pts = kmeans_model.cluster_centers_
        cluster_pts.shape

        distances = []
        # print(np.sum((d1_num - center) ** 2))
        for center in cluster_pts:
            
            # print(d1_num.shape)
            distances.append(np.sum((d1_num - center) ** 2))                
        distances = np.reshape(distances, cluster_pts.shape)

        dist = distances.sum(axis=1)
        print(dist)

        closest_centroid = np.argmin(dist)
        print("Cluster is ",closest_centroid)

        #print(df_num.loc[df_num["Cluster"]==closest_centroid].sample(5))

        df['Cluster'] = kmeans_model.labels_
        result = df.loc[df["Cluster"]==closest_centroid].sample(5)
        result = result.loc[:, ~result.columns.str.contains('^Unnamed')]
        print(result.to_json())
        return result.to_dict()

if __name__ == '__main__':
    app.run()
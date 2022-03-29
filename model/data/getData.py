from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
import pandas as pd 

class GetMusic:
    app = Flask(__name__)

    app.config['MONGO_DBNAME'] = 'sparrowhawk'
    app.config['MONGO_URI'] = 'mongodb+srv://dbUser:sparrowhawk@tcd.1rssu.mongodb.net/sparrowhawk?retryWrites=true&w=majority'

    mongo = PyMongo(app)

    @app.route('/getMusic', methods=['GET'])
    def getMusic():
        user = GetMusic.mongo.db.music
        op = []

        for data in user.find():
            op.append({'valence':data['valence'],'year':data['year'],'acousticness':data['acousticness'],'artists':data['artists'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'explicit':data['explicit'],'id':data['id'],'instrumentalness':data['instrumentalness'],'key':data['key'],'liveness':data['liveness'],'loudness':data['loudness'],'mode':data['mode'],'name':data['name'],'popularity':data['popularity'],'release_date':data['release_date'],'speechiness':data['speechiness'],'tempo':data['tempo']})
        return op

    def get(self):
        musicList=GetMusic.getMusic()
        df = pd.json_normalize(musicList)
        
        return df    


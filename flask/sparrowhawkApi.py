from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import cross_origin
import pickle
import math
import pymongo
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
    likedSongs = []
    
    user = mongo.db.user
    content = request.get_json(force=True)
    data = user.count_documents({'email':content['email']})
    # if()
    # print(data[0])
    if(data == 0):
        user.insert_one({'email':content['email']})
        return jsonify({'status code':"200", 'message':"User Added successfully"})
    else:
        return jsonify({'status code':"200","message":"User Already exists"})
    # print(content)
    
    # print(str(id))
    
    print(data[0]['_id'])
    id = data[0]['_id']
    
@app.route('/getUserId/<mil>', methods=['GET'])
# @cross_origin()
def getUserId(mil):
    user = mongo.db.user
    # content = request.get_json(force=True)
    # print(content)
    data = user.find({'email':mil})    
    id = data[0]['_id']
    return jsonify({'id' : str(id)})
    
@app.route('/addLikedSong/', methods=['POST'])
@cross_origin()
def addLikedSong():

    user = mongo.db.user
    content = request.get_json(force=True)
    # print(content)
    # print(type(content['song']))
    
    result = user.find({'email': content['email']})
    # print(result[0])
    for i in result:
        # print("op")
        # print(i)
        key ="likedSongs"
        df = pd.read_csv('test.csv')
        data = df[df['id'] == list(content['song'].keys())[0]].iloc[0]
        print(data)
        # print("Content keys....  ",content.keys())
        if(key not in i):
            result = user.update_one({'email': content['email']}, {'$push': {'likedSongs': content['song']}})
            result = user.update_one({'email': content['email']}, {'$set':{'avg_valence':data['valence'],'avg_acousticness':data['acousticness'],'avg_danceability':data['danceability'],'avg_energy':data['energy'],'avg_instrumentalness':data['instrumentalness'],'avg_liveness':data['liveness'],'avg_loudness':data['loudness'],'avg_speechiness':data['speechiness'],'avg_tempo':data['tempo']}})
            return jsonify({'status':"200","message":"Song added"})
        else:
            print(i['likedSongs'])
            likedSongs_ = []
            for j in i['likedSongs']:
                likedSongs_.append(list(j.keys())[0])
            
            if (list(content['song'].keys())[0] in likedSongs_):
                return jsonify({'status':"200","message":"Song Already added"})
            else:
                result = user.update_one({'email': content['email']}, {'$push': {'likedSongs': content['song']}})
                
                new_valence,new_acousticness,new_danceability,new_energy,new_instrumentalness,new_liveness,new_loudness,new_speechiness,new_tempo=recalculateAverageScores(content)
                result = user.update_one({'email': content['email']}, {'$set':{'avg_valence':new_valence,'avg_acousticness':new_acousticness,'avg_danceability':new_danceability,'avg_energy':new_energy,'avg_instrumentalness':new_instrumentalness,'avg_liveness':new_liveness,'avg_loudness':new_loudness,'avg_speechiness':new_speechiness,'avg_tempo':new_tempo}})
                
                response = jsonify({'status code' : "200"})
                # response.headers.add("Access-Control-Allow-Origin", "*")
                return response

@app.route('/removeLikedSong/', methods=['POST'])
@cross_origin()
def removeLikedSong():
    user = mongo.db.user
    content = request.get_json(force=True)
    # print(content)
    # print(type(content['song']))
    
    data = user.count_documents({'email':content['email']})
    
    # if()
    # print(data[0])
    if(data != 0):
        #print(content['song'])
        result = user.update_one({'email': content['email']},{'$pull': {'likedSongs':content['song']}})
        new_valence,new_acousticness,new_danceability,new_energy,new_instrumentalness,new_liveness,new_loudness,new_speechiness,new_tempo=recalculateAverageScores(content)
        
    result = user.update_one({'email': content['email']}, {'$set':{'avg_valence':new_valence,'avg_acousticness':new_acousticness,'avg_danceability':new_danceability,'avg_energy':new_energy,'avg_instrumentalness':new_instrumentalness,'avg_liveness':new_liveness,'avg_loudness':new_loudness,'avg_speechiness':new_speechiness,'avg_tempo':new_tempo}})  
    
    response = jsonify({'status code' : "200"})
    # response.headers.add("Access-Control-Allow-Origin", "*")
    return response
    
def recalculateAverageScores(content):
    user = mongo.db.user
    existingUser = user.find({'email':content['email']})    
    songs = existingUser[0]['likedSongs']
    music = mongo.db.music 
    song_list=[]
    for i in songs:
        #print(i)
        
        all_data=music.find({"id" : list(i.keys())[0]})
        for data in all_data:
            list_of_features=[data['valence'],data["acousticness"],data["danceability"],data["energy"],data["instrumentalness"],data["liveness"],data["loudness"],data["speechiness"],data["tempo"]]
            song_list.append(list_of_features)
            #print(song_list)
    
    new_valence=find_featureVal(0,song_list)
    new_acousticness=find_featureVal(1,song_list)
    new_danceability=find_featureVal(2,song_list)
    new_energy=find_featureVal(3,song_list)
    new_instrumentalness=find_featureVal(4,song_list)
    new_liveness=find_featureVal(5,song_list)
    new_loudness=find_featureVal(6,song_list)
    new_speechiness=find_featureVal(7,song_list)
    new_tempo=find_featureVal(8,song_list)

    #print(new_tempo)
    
    return new_valence,new_acousticness,new_danceability,new_energy,new_instrumentalness,new_liveness,new_loudness,new_speechiness,new_tempo

def find_featureVal(n,song_list):
    feature_val_list= [feature[n] for feature in song_list]
    print(feature_val_list)
    count=0.0
    total=0.0
    vals=[]
    for i in feature_val_list:
        count=count+1.0
        total=float(i)*count
        vals.append(total)
    val=math.fsum(vals)/float(sum(range(int(count+1.0))))
    return val


@app.route('/getLikedSongs/<mil>', methods=['GET'])
# @cross_origin()
def getLikedSongs(mil):
    user = mongo.db.user
    # content = request.get_json(force=True)
    # print(content)
    data = user.find({'email':mil})    
    id = data[0]['likedSongs']
    response = jsonify({'likedSongs' : id,'status code':"200"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

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

@app.route('/recommendByPopularity', methods=['GET'])
def recommendByPopularity():
    main_data = mongo.db.music
    op = []

    for data in main_data.find().sort('popularity',pymongo.DESCENDING).limit(10):
        op.append({'valence':data['valence'],'year':data['year'],'acousticness':data['acousticness'],'artists':data['artists'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'explicit':data['explicit'],'id':data['id'],'instrumentalness':data['instrumentalness'],'key':data['key'],'liveness':data['liveness'],'loudness':data['loudness'],'mode':data['mode'],'name':data['name'],'popularity':data['popularity'],'release_date':data['release_date'],'speechiness':data['speechiness'],'tempo':data['tempo']})
    
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

@app.route('/getBasedOnGenreType', defaults={'genre_type':'ACDC'})
@app.route('/getBasedOnGenreType/<genre_type>', methods=['GET'])
def getBasedOnGenreType(genre_type):
    print(genre_type)
    user = mongo.db.dataWGenres
    all_data=user.find({"genres" : {'$regex': genre_type}})
    op = []

    for data in all_data:    
        
        if(data['artists'] == "$NOT" or data['artists'] == ""):
            continue
        else:
            
            op.append({'genres':data['genres'],'artists':data['artists'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key'],'mode':data['mode'],'count':data['count']})
    return jsonify({'results' : op})

@app.route('/getSpecificSong', defaults={'song_id':'ACDC'})
@app.route('/getSpecificSong/<song_id>', methods=['GET'])
def getSpecificSong(song_id):
    print(song_id)
    user = mongo.db.music 
    all_data=user.find({"id" : song_id})
    print(all_data)
    op = []

    for data in all_data:
        op.append({'valence':data['valence'],'year':data['year'],'acousticness':data['acousticness'],'artists':data['artists'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'explicit':data['explicit'],'id':data['id'],'instrumentalness':data['instrumentalness'],'key':data['key'],'liveness':data['liveness'],'loudness':data['loudness'],'mode':data['mode'],'name':data['name'],'popularity':data['popularity'],'release_date':data['release_date'],'speechiness':data['speechiness'],'tempo':data['tempo']})

    return jsonify({'results' : op})    

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
# @cross_origin()
def recommend(id):
    # content = request.get_json(force=True)
    print(id)
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
    kt=cj[['id','name']]
    
    kt.reset_index(drop=True)
    print(kt) 
    op['songs']=dict(zip(cj['id'], cj['name']))
    
    # for i in zip(cj['id'], cj['name']):
    #     songs = {}
    #     songs[i[0]] = i[1]
    #     op['songs'].append(songs)
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

@app.route('/setPreferences', methods=['POST'])
@cross_origin()
def setPreferences():
    user = mongo.db.user
    content = request.get_json(force=True)
    print(content)
    result = user.find({'email': content['email']})
    # print(result[0])
    for i in result:
        # print("op")
        # print(i)
        key ="artists"
        
        df = pd.read_csv('test.csv')
        # print()
        data = df[df['id'] == list(content['song'].keys())[0]].iloc[0]
        # print(data)
        # print("Content keys....  ",content.keys())
        if(key not in i):
            result = user.update_one({'email': content['email']}, {'$push': {'artists': content['artist']}})
            result = user.update_one({'email': content['email']}, {'$push': {'likedSongs': content['song']}})
            result = user.update_one({'email': content['email']}, {'$set':{'avg_valence':data['valence'],'avg_acousticness':data['acousticness'],'avg_danceability':data['danceability'],'avg_energy':data['energy'],'avg_instrumentalness':data['instrumentalness'],'avg_liveness':data['liveness'],'avg_loudness':data['loudness'],'avg_speechiness':data['speechiness'],'avg_tempo':data['tempo']}})
            return jsonify({'status code':"200", 'message':"Artist and song Added successfully"})
        else:
            if(content['artist'] not in i['artists']):
                result = user.update_one({'email': content['email']}, {'$push': {'artists': content['artist']}})
                return jsonify({'status code':"200", 'message':"Artist Added successfully"})
            else:
                return jsonify({'status code':"200", 'message':"Artist exists already"})
        
        
    # op ={}
    # df = pd.read_csv('test.csv')    
    # cj = df.sample(n = 6)
    # op['songs']=cj[['id','name']].to_dict()
    # print(op)
    # cj = df.sample(n = 6)
    # artists =[]
    # for i in cj['artists']:
    #     tmp = i.replace("\'", "$")
    #     artists.append(tmp.split('$')[1])
    #     # print(tmp.split('$'))
    #     # print(list(i)[0])
    # # print(artists)
    # op['artists'] = artists
    
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def predict(user_id):
        #importing clustered data from csv file
        data = pd.read_csv('kmeans_result.csv',index_col=False)
        num_cols = ['valence','year','acousticness','danceability','duration_ms','energy','instrumentalness','liveness','loudness','speechiness','tempo']
        data[num_cols] =data[num_cols].apply(pd.to_numeric)

        user = mongo.db.user
        result = pd.DataFrame(user.find({'email': user_id}))
        data["diff"]=999.999
        for i in result:
            print("Result... ",i,"  Value...  ",result[i])
        data["diff"]=abs(data["valence"]- result["avg_valence"][0])+abs(data["acousticness"]- result["avg_acousticness"][0])+abs(data["danceability"]- result["avg_danceability"][0])+abs(data["energy"]- result["avg_energy"][0])+abs(data["instrumentalness"]- result["avg_instrumentalness"][0])+abs(data["liveness"]- result["avg_liveness"][0])+abs(data["loudness"]- result["avg_loudness"][0])+abs(data["speechiness"]- result["avg_speechiness"][0])+abs(data["tempo"]- result["avg_tempo"][0])
        # print("Data columns... ",data.columns)
        data.sort_values(by=['diff'], ascending=[True])
        # print("Data head.. ",data.head())
        # print("Min diff..  ",data['diff'].min())
        # print("Min Cluster... ",np.array(data[data['diff'] == data['diff'].min()]['Cluster'].sample(1)))
        closest_cluster = data[data['diff'] == data['diff'].min()]['Cluster'].sample(1).values[0]

        result = data.loc[data["Cluster"]==closest_cluster].sample(5)
        print(result.to_json())
        return result.to_dict()

@app.route('/searchDatabase', defaults={'searchString':''})
@app.route('/searchDatabase/<searchString>', methods=['GET'])
def searchDatabase(searchString):
    user = mongo.db.music 
    all_data=user.find({"name":{"$regex":".*"+searchString+".*", '$options' : 'i'}}).sort('popularity',pymongo.DESCENDING).limit(10)
    print(all_data)
    op = []

    for data in all_data:
        op.append({'name':data['name'],'artists':data['artists'],'songId':data['id']})
    response = jsonify({'results' : op})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run()
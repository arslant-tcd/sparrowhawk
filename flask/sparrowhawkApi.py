from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

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
    return jsonify({'results' : op})

@app.route('/addUser', methods=['POST'])
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
    return jsonify({'results' : op})

@app.route('/getDataByGenres', methods=['GET'])
def getDataByGenres():
    user = mongo.db.dataByGenres
    op = []

    for data in user.find():
        
        op.append({'mode':data['mode'],'genres':data['genres'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key']})
    return jsonify({'results' : op})

@app.route('/getDataByYear', methods=['GET'])
def getDataByYear():
    user = mongo.db.dataByYear
    op = []

    for data in user.find():
        
        op.append({'mode':data['mode'],'year':data['year'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key']})
    return jsonify({'results' : op})

@app.route('/getDataWGenre', methods=['GET'])
def getDataWGenre():
    user = mongo.db.dataWGenres
    op = []

    for data in user.find():
        
        op.append({'genres':data['genres'],'artists':data['artists'],'acousticness':data['acousticness'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'instrumentalness':data['instrumentalness'],'liveness':data['liveness'],'loudness':data['loudness'],'speechiness':data['speechiness'],'tempo':data['tempo'],'valence':data['valence'],'popularity':data['popularity'],'key':data['key'],'mode':data['mode'],'count':data['count']})
    return jsonify({'results' : op})

@app.route('/getMusic', methods=['GET'])
def getMusic():
    user = mongo.db.music
    op = []

    for data in user.find():
        
        op.append({'valence':data['valence'],'year':data['year'],'acousticness':data['acousticness'],'artists':data['artists'],'danceability':data['danceability'],'duration_ms':data['duration_ms'],'energy':data['energy'],'explicit':data['explicit'],'id':data['id'],'instrumentalness':data['instrumentalness'],'key':data['key'],'liveness':data['liveness'],'loudness':data['loudness'],'mode':data['mode'],'name':data['name'],'popularity':data['popularity'],'release_date':data['release_date'],'speechiness':data['speechiness'],'tempo':data['tempo']})
    return jsonify({'results' : op})

if __name__ == '__main__':
    app.run()
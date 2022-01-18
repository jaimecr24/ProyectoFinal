"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import func
from api.models import db, User, Customer, Film, Place, Country, FavPlace, Scene, PhotoPlace, Comment
from api.utils import generate_sitemap, APIException
from datetime import datetime
import json
import random

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }

    return jsonify(response_body), 200

#backup and restore all data of db.
@api.route("/backup", methods=["GET","POST"])
@jwt_required()
def backup():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user.category:
        return { "msg": "access denied"}, 400
    if request.method == "GET":
        users = User.query.all()
        customers = Customer.query.all()
        countries = Country.query.all()
        films = Film.query.all()
        places = Place.query.all()
        scenes = Scene.query.all()
        favPlaces = FavPlace.query.all()
        comments = Comment.query.all()
        return jsonify({
            "users": [{ "id": user.id, "email": user.email, "password": user.password, "username": user.username, "category": user.category, "lastTime": user.lastTime } for user in users],
            "customers": [customer.serialize() for customer in customers],
            "countries": [country.serialize() for country in countries],
            "films": [film.serialize() for film in films],
            "places": [{"id":place.id, "idCountry":place.idCountry, "name":place.name, "latitude":place.latitude, "longitude":place.longitude, "address": place.address, "description":place.description, "countLikes":place.countLikes, "entryDate":place.entryDate, "urlPhoto":place.urlPhoto} for place in places],
            "scenes": [{"id":scene.id, "idFilm":scene.idFilm, "idPlace":scene.idPlace, "description":scene.description, "urlPhoto":scene.urlPhoto, "spoiler":scene.spoiler } for scene in scenes],
            "favPlaces": [favplace.serialize() for favplace in favPlaces],
            "comments": [{"id":comment.id, "idUser":comment.idUser, "idPlace":comment.idPlace, "body":comment.body, "time":comment.time, "parentId":comment.parentId } for comment in comments]
            }),200
    else:
        body = request.json
        if body is None: return {"msg":"The request body is null"} , 400
        if not 'users' in body: return {"msg":"missing info of users in body"}, 400
        if not 'customers' in body: return {"msg":"missing info of customers in body"}, 400
        if not 'countries' in body: return {"msg":"missing info of countries in body"}, 400
        if not 'films' in body: return {"msg":"missing info of films in body"}, 400
        if not 'places' in body: return {"msg":"missing info of places in body"}, 400
        if not 'scenes' in body: return {"msg":"missing info of scenes in body"}, 400
        if not 'favPlaces' in body: return {"msg":"missing info of favPlaces in body"}, 400
        if not 'comments' in body: return {"msg":"missing info of comments in body"}, 400

        #delete all previous data
        db.session.query(FavPlace).delete() 
        db.session.query(Comment).delete()
        db.session.query(Customer).delete()
        db.session.query(User).delete()
        db.session.query(Scene).delete()
        db.session.query(Film).delete()
        db.session.query(Place).delete()
        db.session.query(Country).delete()
        db.session.commit()
        print("all tables deleted")
        #insert new data
        users = body.get("users")
        for user in users:
            newuser = User(id=user.get("id"),email=user.get("email"),password=user.get("password"),username=user.get("username"),category=user.get("category"),lastTime=user.get("lastTime"))
            db.session.add(newuser)
        customers = body.get("customers")
        for customer in customers:
            newcustomer = Customer(id=customer.get('id'),idUser=customer.get('idUser'),name=customer.get('name'),last_name=customer.get('last_name'))
            db.session.add(newcustomer)
        countries = body.get("countries")
        for country in countries:
            newcountry = Country(id=country.get('id'),name=country.get('name'),urlFlag=country.get('urlFlag'),description=country.get('description'))
            db.session.add(newcountry)
        places = body.get("places")
        for place in places:
            newplace = Place(id=place.get('id'), idCountry=place.get('idCountry'), name=place.get('name'), latitude=place.get('latitude'), longitude=place.get('longitude'), address=place.get('address'), description=place.get('description'), countLikes=place.get('countLikes'), entryDate=place.get('entryDate'), urlPhoto=place.get('urlPhoto'))
            db.session.add(newplace)
        films = body.get("films")
        for film in films:
            newfilm = Film(id=film.get('id'), name=film.get('name'), director=film.get('director'), year=film.get('year'), description=film.get('description'), urlPhoto=film.get('urlPhoto'))
            db.session.add(newfilm)
        scenes = body.get("scenes")
        for scene in scenes:
            newscene = Scene(id=scene.get('id'), idFilm=scene.get('idFilm'), idPlace=scene.get('idPlace'), description=scene.get('description'), urlPhoto=scene.get('urlPhoto'), spoiler=scene.get('spoiler'))
            db.session.add(newscene)
        favPlaces = body.get("favPlaces")
        for favPlace in favPlaces:
            newfavPlace = FavPlace(id=favPlace.get('id'), idUser=favPlace.get('idUser'), idPlace=favPlace.get('idPlace'))
            db.session.add(newfavPlace)
        comments = body.get("comments")
        for comment in comments:
            newcomment = Comment(id=comment.get('id'), idUser=comment.get('idUser'), idPlace=comment.get('idPlace'), body=comment.get('body'), time=comment.get('time'), parentId=comment.get('parentId'))
            db.session.add(newcomment)
        db.session.commit()
        
        return jsonify({"msg": "data loaded ok"}), 200

@api.route("/users/count", methods=["GET"])
def countUsers():
    rows = db.session.query(func.count(User.id)).scalar()
    return { "msg": "ok", "count": rows }, 200

@api.route("films/random", methods=["GET"])
def randomFilm():
    numFilms = db.session.query(func.count(Film.id)).scalar()
    if numFilms == 0: return { "msg": "No films" }, 400
    rnd = random.randint(0,numFilms-1)
    myfilm = Film.query[rnd]
    return jsonify(myfilm.serialize()), 200

#Get data of all users in db. Token and user category true necessary
@api.route("/users", methods=["GET"])
@jwt_required()
def getAllUsers():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user.category:
        return { "msg": "access denied"}, 400

    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

@api.route("/users/<int:limitInf>/<int:limitSup>", methods=["GET"])
@jwt_required()
def getNUsers(limitInf, limitSup):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user.category:
        return { "msg": "access denied"}, 400
    #load only a subset of rows    
    users = User.query[limitInf:limitSup]
    return jsonify([user.serialize() for user in users]), 200

#Get/Put/Delete data of a single user
@api.route("/user/<int:user_id>", methods=["GET", "PUT", "DELETE"])
@jwt_required()
def singleUser(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id) # The user who makes the request must be an admin user.
    if not user.category:
        return { "msg": "access denied"}, 400

    user = User.query.get(user_id)
    if user is None: return { "msg": "id not exists"}, 400
    if request.method == "GET":
        return jsonify(user.serialize())
    elif request.method == "PUT":
        body = request.json
        if body is None: return {"msg":"The request body is null"}, 400
        if 'email' in body: user.email = body.get("email")
        if 'username' in body: user.username = body.get("username")
        if 'category' in body: user.category = body.get("category")
        if 'name' in body or 'last_name' in body:
            customer = Customer.query.filter_by(idUser=user_id).first()
            if 'name' in body: customer.name = body.get("name")
            if 'last_name' in body: customer.last_name = body.get("last_name")
        db.session.commit()
        return {"msg":"user updated"}, 200
    else:
        #Delete user
        customer = Customer.query.filter_by(idUser=user_id).first()
        listFav = FavPlace.query.filter_by(idUser=user_id)
        listComments = Comment.query.filter_by(idUser=user_id)
        #First we must delete all his favorites and comments
        #and update the countLikes of every place in favorites
        for item in listFav:
            place = Place.query.get(item.idPlace)
            if place.countLikes>0: place.countLikes -= 1
            db.session.delete(item)
        for item in listComments: db.session.delete(item)
        db.session.delete(customer)
        db.session.delete(user)
        db.session.commit()
        return {"msg":"user deleted"}, 200

#registro del usuario
@api.route("/signup", methods=["POST"])
def signup():
    #Get data from request
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name = request.json.get("name", None)
    lastname = request.json.get("lastname", None)
    username = request.json.get("username", None)
    category = request.json.get("category", None)

    #Check if user exists in database
    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User.query.filter_by(username=username).first()
        if user is None:
            #Create registres in User and Login
            newuser = User(email=email, password=password, username=username, lastTime=None, category=category)
            db.session.add(newuser)
            #Query to get the id of new user
            userdata = User.query.filter_by(username=username).first()
            customer = Customer(idUser=userdata.id, name=name, last_name=lastname)
            db.session.add(customer)
            db.session.commit()
            return jsonify({"message": "ok", "id": userdata.id, "name":customer.name, "last_name":customer.last_name}), 200
        else:
            return jsonify({"error":"username already exists"}), 461
    else:
        return jsonify({"error":"email already exists"}), 462


@api.route("/login", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    
    # Query database for email/username and password
    if username is None:
        if email is None:
            return jsonify({"error":"username and email are null"}), 400
        else:
            user = User.query.filter_by(email=email).first()
    else:
        user = User.query.filter_by(username=username).first()

    if user is None:
        # the user was not found on the database
        if username is None:
            return jsonify({"error": "bad email"}), 464
        else:
            return jsonify({"error": "bad username"}), 463
    elif user.password != password:
        return jsonify({"error": "bad password"}), 465

    # create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    # get the last time login for return in json, and update lastTime in database with the current value
    # the first time after signup, the returned lastTime will be null
    lastTime = user.lastTime
    if lastTime: lastTime = lastTime.isoformat()
    user.lastTime = datetime.now()
    db.session.commit()
    return jsonify({ "message": "ok", "token": access_token, "id": user.id, "lastTime": lastTime, "category": user.category }), 200


#profile (protected), returns data of current user.
@api.route("/profile", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.serialize()), 200


#favorite places of user (protected)
#for each place get also the country name and the first photo in PhotoPlace
@api.route("/favorites", methods=["GET"])
@jwt_required()
def getFavPlaces():
    
    current_user_id = get_jwt_identity()
    favPlaces = FavPlace.query.filter_by(idUser=current_user_id)
    if favPlaces is None:
        return jsonify({"count":0, "msg":"ok", "items":[]})
        
    res = []
    for elem in favPlaces:
        place = Place.query.get(elem.idPlace)
        country = Country.query.get(place.idCountry)
        res.append({
            "id": place.id, "name":place.name, "latitude":place.latitude, "longitude":place.longitude,
            "description":place.description, "countryName":country.name, "urlPhoto":place.urlPhoto
        })
    return jsonify({"count":favPlaces.count(), "msg":"ok", "items":res}), 200


#Add/Delete a single place in favorites of user and inc/dec the countLikes of place
@api.route("/favorite/<int:place_id>", methods=['DELETE','POST'])
@jwt_required()
def delFavPlace(place_id):

    current_user_id = get_jwt_identity()
    place = Place.query.get(place_id)
    if place is None:
        #Check the place exists
        return jsonify({"msg": "idPlace not exists"}), 400

    if request.method == 'POST':
        if FavPlace.query.filter_by(idUser=current_user_id, idPlace=place_id).first():
            #Check the favorite not exists
            return jsonify({"msg":"error: favorite already exists"}), 400
        #Add the favorite
        favPlace = FavPlace(idUser=current_user_id, idPlace=place_id)
        db.session.add(favPlace)
        place.countLikes = place.countLikes + 1
        db.session.commit()
        return jsonify({"msg":"ok"}), 200
    else:
        #DELETE
        favPlace = FavPlace.query.filter_by( idUser=current_user_id, idPlace=place_id ).first()
        if favPlace is None:
            #Check the favorite exists
            return jsonify({"msg":"error: favorite not exists"}), 400
        db.session.delete(favPlace)
        place.countLikes = place.countLikes - 1
        db.session.commit()
        return jsonify({"msg":"ok"}), 200

#GET FAVORITES BY PLACE (not by user)
@api.route('/favplace/<int:place_id>', methods=['GET'])
def listFavsByPlace(place_id):    
    list_favs_byPlace = FavPlace.query.filter_by(idPlace=place_id) 
    return jsonify([favplace.serialize() for favplace in list_favs_byPlace]), 200


#Get a list of places that match a key
@api.route('/browse/<key>', methods=['GET'])
def browsePlace(key):
    places = Place.query.filter(Place.name.ilike("%"+key+"%"))
    lista = [{"id":place.id, "name":place.name} for place in places]
    return jsonify(lista), 200


    #ALL PLACES GET
@api.route('/places', methods=['GET', 'POST'])
def listPlaces():
    
    if request.method == 'GET':
        #Return all places
        list_places = Place.query.all() 
        return jsonify([place.serialize() for place in list_places]), 200

    # POST a new place
    if request.method == 'POST':
        data = request.json
        id = data.get("id")
        existsPlace = Place.query.filter_by(id=id).first()
        existsCountry = Country.query.filter_by(id=data.get("idCountry")).first()
        likes=FavPlace.query.filter_by(idPlace=id).count()

    # Data validation
    if existsPlace is not None:        
        raise APIException(f"place with id {id} already exists", status_code=400)
    if existsCountry is None:        
        raise APIException("Country not found in data base", status_code=400)
    if 'name' not in data:
        raise APIException('You need to add the name', status_code=400)
    if 'idCountry' not in data:
        raise APIException('You need to add the country id', status_code=400)
    if data is None:
        raise APIException("You need to add the request body as a json object", status_code=400)
    
    if 'id' in data:
        new_place = Place(id=data.get("id"), idCountry=data.get("idCountry"), name=data.get("name"), latitude=data.get("latitude"), longitude=data.get("longitude"), description=data.get("description"), countLikes=likes, entryDate=datetime.now(), urlPhoto=data.get("urlPhoto"), address=data.get("address"))
    elif 'id' not in data:
        new_place = Place(idCountry=data.get("idCountry"), name=data.get("name"), latitude=data.get("latitude"), longitude=data.get("longitude"), description=data.get("description"), countLikes=likes, entryDate=datetime.now(), urlPhoto=data.get("urlPhoto"), address=data.get("address"))
    db.session.add(new_place)
    db.session.commit()
    return jsonify([{'message': 'added ok'}, new_place.serialize()]),200


#SINGLE PLACE GET AND DELETE
@api.route('/places/<int:place_id>', methods=['GET', 'DELETE'])
def getPlace(place_id):

    place = Place.query.filter_by(id=place_id).first()

    # Data validation
    if place is None:
        raise APIException(f"place with id {place_id} not found in data base", status_code=404)

    #GET a place
    if request.method == 'GET':
        return jsonify(place.serialize()), 200

    #DELETE a place
    if request.method == 'DELETE':
        db.session.delete(place)
        db.session.commit()
        return jsonify({'message': f'place with id {place_id} deleted'}), 200

      
@api.route('/films', methods=['GET', 'POST'])
def list_film():
     # GET all films
    if request.method == 'GET':
        list_film = Film.query.all()
    return jsonify([film.serialize() for film in list_film]), 200

    # POST a new film
    if request.method == 'POST':
        film_to_add = request.json

    # Data validation
    if film_to_add is None:
        raise APIException("You need to add the request body as a json object", status_code=400)
    if 'name' not in film_to_add:
        raise APIException('You need to add the name', status_code=400)
    if 'img_url' not in film_to_add:
         url = None
    else: url = film_to_add["img_url"]

    new_film = Film(name=film_to_add["name"], img_url=url)
    db.session.add(new_film)
    db.session.commit()
    return jsonify(new_film.serialize()), 200

@api.route('/films/<int:film_id>', methods=['GET', 'DELETE'])
def getfilm(film_id):

    film = Film.query.filter_by(id=film_id).first()

    # GET a film
    if request.method == 'GET':
        return jsonify(film.serialize()), 200

    # DELETE a film
    if request.method == 'DELETE':
        db.session.delete(film)
        db.session.commit()

@api.route('/countries', methods=['GET', 'POST'])
def list_country():
     # GET all countries
    if request.method == 'GET':
        list_country = Country.query.all()
    return jsonify([country.serialize() for country in list_country]), 200

    # POST a new country
    if request.method == 'POST':
        country_to_add = request.json

    # Data validation
    if country_to_add is None:
        raise APIException("You need to add the request body as a json object", status_code=400)
    if 'name' not in country_to_add:
        raise APIException('You need to add the name', status_code=400)
    if 'img_url' not in country_to_add:
         url = None
    else: url = country_to_add["img_url"]

    new_country = Country(name=country_to_add["name"], img_url=url)
    db.session.add(new_country)
    db.session.commit()
    return jsonify(new_country.serialize()), 200

@api.route('/countries/<int:country_id>', methods=['GET', 'DELETE'])
def getcountry(country_id):

    country = Country.query.filter_by(id=country_id).first()

    # GET a film
    if request.method == 'GET':
        return jsonify(country.serialize()), 200

    # DELETE a film
    if request.method == 'DELETE':
        db.session.delete(country)
        db.session.commit()

    #ALL SCENES GET
@api.route('/scenes', methods=['GET', 'POST'])
def listScenes():
     # GET all scenes
    list_scenes = Scene.query.all()
    if request.method == 'GET':
        return jsonify([scene.serialize() for scene in list_scenes]), 200

    # POST a new scene
    if request.method == 'POST':
        data = request.json
        id = data.get("id")
        existsScene = Scene.query.filter_by(id=id).first()
        existsPlace = Place.query.filter_by(id=data.get("idPlace")).first()
        existsFilm = Film.query.filter_by(id=data.get("idFilm")).first()

    # Data validation
    if existsScene is not None:        
        raise APIException(f"scene with id {id} already exists", status_code=400)
    if existsPlace is None:        
        raise APIException("Place not found in data base", status_code=400)
    if existsFilm is None:        
        raise APIException("Film not found in data base", status_code=400)
    if 'idPlace' not in data:
        raise APIException('You need to add the place id', status_code=400)
    if 'idFilm' not in data:
        raise APIException('You need to add the film id', status_code=400)
    if data is None:
        raise APIException("You need to add the request body as a json object", status_code=400)
    
    if 'id' in data:
        new_scene = Scene(id=data.get("id"), idPlace=data.get("idPlace"), idFilm=data.get("idFilm"), description=data.get("description"), urlPhoto=data.get("urlPhoto"), spoiler=data.get("spoiler"))
    elif 'id' not in data:
        new_scene = Scene(idPlace=data.get("idPlace"), idFilm=data.get("idFilm"), description=data.get("description"), urlPhoto=data.get("urlPhoto"), spoiler=data.get("spoiler"))
    db.session.add(new_scene)
    db.session.commit()
    return jsonify([{'message': 'added ok'}, new_scene.serialize()]),200


    #GET SCENES BY PLACE
@api.route('/scenes/place/<int:place_id>', methods=['GET'])
def listScenesByPlace(place_id):    
    list_scenes_byPlace = Scene.query.filter_by(idPlace=place_id) 
    return jsonify([scene.serialize() for scene in list_scenes_byPlace]), 200

    #GET SCENES BY FILM
@api.route('/scenes/film/<int:film_id>', methods=['GET'])
def listScenesByFilm(film_id):    
    list_scenes_byFilm = Scene.query.filter_by(idFilm=film_id) 
    return jsonify([scene.serialize() for scene in list_scenes_byFilm]), 200

@api.route('/films/country/<int:country_id>', methods=['GET'])
def listFilmsByCountry(country_id):
    list_places_byCountry = Place.query.filter_by(idCountry=country_id) 
    listFilms = []
    for place in list_places_byCountry:
        scenes = Scene.query.filter_by(idPlace=place.id)
        for scene in scenes:
            film = Film.query.get(scene.idFilm)
            if film not in listFilms: listFilms.append(film)
    return jsonify([film.serialize() for film in listFilms]), 200

@api.route('/places/country/<int:country_id>', methods=['GET'])
def listPlacesByCountry(country_id):
    list_places_byCountry = Place.query.filter_by(idCountry=country_id) 
    return jsonify([place.serialize() for place in list_places_byCountry]), 200

@api.route('/places/film/<int:film_id>', methods=['GET'])
def listPlacesByFilm(film_id):
    list_scenes_byFilm= Scene.query.filter_by(idFilm=film_id) 
    listPlaces = []
    for scene in list_scenes_byFilm:
        place = Place.query.get(scene.idPlace)
        if place not in listPlaces: listPlaces.append(place)
    return jsonify([place.serialize() for place in listPlaces]), 200

#SINGLE SCENE GET AND DELETE
@api.route('/scenes/<int:scene_id>', methods=['GET', 'DELETE'])
def getScene(scene_id):

    scene = Scene.query.filter_by(id=scene_id).first()

    # Data validation
    if scene is None:
        raise APIException(f"scene with id {scene_id} not found in data base", status_code=404)

    #GET a scene
    if request.method == 'GET':
        return jsonify(scene.serialize()), 200

    #DELETE a place
    if request.method == 'DELETE':
        db.session.delete(scene)
        db.session.commit()
        return jsonify({'message': f'scene with id {scene_id} deleted'}), 200

@api.route("/comments", methods=["GET"])
@jwt_required()
def getComments():
    
    current_user_id = get_jwt_identity()
    place = request.args.get("place")
    comments = Comment.query.filter_by(idPlace=place)
    if comments is None:
        return jsonify({"count":0, "msg":"ok", "items":[]})
        
    res = []
    for elem in comments:
        
        res.append(elem.serialize())
    return jsonify({"count":comments.count(), "msg":"ok", "items":res}), 200
    
@api.route('/comments', methods=['POST'])
@jwt_required()
def add_comments():

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    # POST a new comment
    comment_to_add = request.json

    # Data validation
    if comment_to_add is None:
        raise APIException("You need to add the request body as a json object", status_code=400)
    # if 'name' not in comment_to_add:
    #     raise APIException('You need to add the name', status_code=400)
    
    new_comment = Comment( time=datetime.now().date(), idPlace=comment_to_add["idPlace"], body=comment_to_add["body"], idUser=user.id, parentId=comment_to_add.get("parentId") )
    # new_comment = Comment(parentId=comment_to_add.get("parentId"), createdAt=datetime.now().date(), idPlace=comment_to_add["idPlace"], body=comment_to_add["body"], userId=user.id, username=user.username )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(new_comment.serialize()), 200


@api.route('/comments-removed/<int:comments_id>', methods=['POST'])
@jwt_required()
def delete_comments(comments_id):

    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    comments = Comment.query.filter_by(id=comments_id, idUser= user.id).first()

    if comments: 
        db.session.delete(comments)
        db.session.commit()

        return jsonify("Comment deleted"), 200
    raise APIException("You need to add the comment as a json object", status_code=400)

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    category = db.Column(db.Boolean(), unique=False, nullable=False) #false for user, true for admin
    lastTime = db.Column(db.DateTime)
    customer = db.relationship("Customer", back_populates="user", uselist=False)
    
    def __repr__(self):
        return '<User %r>' % self.email

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "category": self.category,
            "lastTime": self.lastTime,
            "name": self.customer.name,
            "last_name": self.customer.last_name
        }

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idUser = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=True)

    user = db.relationship("User", back_populates="customer")

    def __repr__(self):
        return '<Customer %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "idUser": self.idUser,
            "name": self.name,
            "last_name": self.last_name
        }


class Film(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    director = db.Column(db.String(80), unique=False, nullable=False)
    year = db.Column(db.Integer)
    description = db.Column(db.String)
    urlPhoto = db.Column(db.String)

    def __repr__(self):
        return '<Film %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "director": self.director,
            "year": self.year,
            "urlPhoto": self.urlPhoto,
            "description": self.description
        }


class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idCountry = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=False)
    latitude = db.Column(db.String)
    longitude = db.Column(db.String)
    address = db.Column(db.String)
    description = db.Column(db.String)
    countLikes = db.Column(db.Integer)
    entryDate = db.Column(db.Date)
    urlPhoto = db.Column(db.String)
    country = db.relationship('Country')

    def __repr__(self):
        return '<Place %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "idCountry": self.idCountry,
            "name": self.name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "address": self.address,
            "description": self.description,
            "countLikes": self.countLikes,
            "entryDate": self.entryDate,
            "urlPhoto": self.urlPhoto

        }
    

class Country(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    urlFlag = db.Column(db.String)
    description = db.Column(db.String)

    def __repr__(self):
        return '<Country %r>' % self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "urlFlag": self.urlFlag,
            "description": self.description
        }


class Scene(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idFilm = db.Column(db.Integer, db.ForeignKey('film.id'), nullable=False)
    idPlace = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    description = db.Column(db.String)
    urlPhoto = db.Column(db.String)
    spoiler = db.Column(db.Boolean(), unique=False) #true = spoiler
    film = db.relationship('Film')
    place = db.relationship('Place')
    

    
    def __repr__(self):
        return '<Scene %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "idFilm": self.idFilm,
            "title": self.film.name,
            "idPlace": self.idPlace,
            "country": self.place.country.name,
            "place": self.place.name,
            "movie": self.film.name,
            "picture": self.place.urlPhoto,
            "description": self.description,
            "urlPhoto": self.urlPhoto,
            "filmPhoto": self.film.urlPhoto,
            "spoiler": self.spoiler
        }



class FavPlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idUser = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    idPlace = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    user = db.relationship('User')
    place = db.relationship('Place')
    
    def __repr__(self):
        return '<FavPlace %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "idUser": self.idUser,
            "idPlace": self.idPlace,
        }


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idUser = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    idPlace = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    body = db.Column(db.String)
    time = db.Column(db.Date)
    user = db.relationship('User')
    place = db.relationship('Place')
    parentId = db.Column(db.Integer,nullable=True)
    
    def __repr__(self):
        return '<Comment %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "userId": self.idUser,
            "parentId": self.parentId,
            "createdAt": self.time,
            "idPlace": self.idPlace,
            "body": self.body,
        }



class PhotoPlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idPlace = db.Column(db.Integer, db.ForeignKey('place.id'), nullable=False)
    urlPhoto = db.Column(db.String)
    description = db.Column(db.String)
    place = db.relationship('Place')
    
    def __repr__(self):
        return '<PhotoPlace %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "idPlace": self.idPlace,
            "urlPhoto": self.urlPhoto,
            "description": self.description
        }
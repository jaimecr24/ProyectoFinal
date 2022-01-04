import os, datetime
from flask_admin import Admin
from .models import db, User, Customer, Film, Place, Country, Scene, PhotoPlace, FavPlace, Comment
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    app.config["JWTSECRETKEY"] = "zxc00cxz"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"]=datetime.timedelta(minutes=60)
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Customer, db.session))
    admin.add_view(ModelView(Film, db.session))
    admin.add_view(ModelView(Place, db.session))
    admin.add_view(ModelView(Country, db.session))
    admin.add_view(ModelView(Scene, db.session))
    admin.add_view(ModelView(PhotoPlace, db.session))
    admin.add_view(ModelView(FavPlace, db.session))
    admin.add_view(ModelView(Comment, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))
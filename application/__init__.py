import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask.ext.login import LoginManager, UserMixin

app = Flask(__name__)
BASE_FOLDER = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
app.static_folder = os.path.join(BASE_FOLDER, 'static')
app.config.from_pyfile('../config')

mail = Mail(app)
db = SQLAlchemy(app)
lm = LoginManager(app)
migrate = Migrate(app, db)

app.config['SQLALC_INSTANCE'] = db
app.config['MAILADDR'] = mail

import application.views

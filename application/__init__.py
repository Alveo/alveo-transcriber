import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_mail import Mail
from flask_login import LoginManager
from rauth import OAuth2Service

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

oauth_alveo = OAuth2Service(
    name='alveo',
    client_id=app.config['OAUTH_ALVEO_APPID'],
    client_secret=app.config['OAUTH_ALVEO_APPSEC'],
    authorize_url='https://example.com/oauth/authorize',           
    access_token_url='https://example.com/oauth/access_token',
    base_url='https://example.com/'
)

# Allow cross origin headers only on dev mode
if app.config['DEVELOPMENT'] == True:
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
        return response

import application.views

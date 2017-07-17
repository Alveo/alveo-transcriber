import json
from flask import abort, request
from flask.views import MethodView
from flask_login import current_user, login_user

from pyapplication import app
from pyapplication.modules.user_model import User

class MockLogin(MethodView):
    def get(self):
        user = User.query.filter(User.alias=="test").first()
        login_user(user, True)

        return "Done"

mocklogin = MockLogin.as_view('mocklogin')

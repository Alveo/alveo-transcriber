from flask import redirect, url_for
from flask_login import UserMixin
from flask.views import MethodView
from flask_login import current_user

from application import db, lm

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    oauth_id = db.Column(db.String(64), nullable=False)

@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

class LogoutView(MethodView):
    def get(self):
        if not current_user.is_anonymous:
            logout_user(user)

        return redirect(url_for('index_view'))

logout_view = LogoutView.as_view('logout_view')

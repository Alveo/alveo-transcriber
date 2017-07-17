from flask_login import UserMixin

from pyapplication import db, lm

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    oauth_id = db.Column(db.String(64), nullable=True) # Allow non-OAuth users
    alias = db.Column(db.String(64), nullable=False)

    def __init__(self, oauth_id=None, alias=None):
        self.alias = alias
        self.oauth_id = oauth_id

    def __repr__(self):
        return self.alias;

@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

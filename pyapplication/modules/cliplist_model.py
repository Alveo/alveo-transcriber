from pyapplication import db
from pyapplication.modules.user_model import User

class ClipItemList(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User')

    title = db.Column(db.String(64), nullable=False)
    last_edit = db.Column(db.DateTime, nullable=False)

    def __init__(self, title=None, last_edit=None, user=None):
        self.tilte = title
        self.user = user

        if last_edit is None:
            last_edit = get_current_datetime()
        self.last_edit = last_edit

    def __repr__(self):
        return self.title;

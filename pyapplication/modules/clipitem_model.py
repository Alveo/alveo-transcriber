from pyapplication import db
from pyapplication.modules.clip_model import Clip
from pyapplication.modules.cliplist_model import ClipItemList

class ClipItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    clip_id = db.Column(db.Integer, db.ForeignKey('clip.id'), nullable=False)
    clip = db.relationship('Clip')

    clip_list_id = db.Column(db.Integer, db.ForeignKey('clip_item_list.id'), nullable=False)
    clip_list = db.relationship('ClipItemList')

    last_edit = db.Column(db.DateTime, nullable=False)
    data = db.Column(db.String(4096), nullable=False)
    tilte = db.Column(db.String(128), nullable=False)

    def __init__(self, title=None, last_edit=None, clip_list=None, clip=None, data=None):
        self.tilte = title
        self.clip_list = clip_list
        self.clip = clip
        self.data = data

        if last_edit is None:
            last_edit = get_current_datetime()
        self.last_edit = last_edit

    def __repr__(self):
        return self.title;

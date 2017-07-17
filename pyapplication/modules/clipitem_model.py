import json

from flask import abort, request

from pyapplication import app, db
from pyapplication.modules.clip_model import Clip
from pyapplication.modules.cliplist_model import ClipItemList

class ClipItem(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)

    clip_id = db.Column(db.Integer, db.ForeignKey('clip.id'), nullable=False)
    clip = db.relationship('Clip')

    clip_list_id = db.Column(db.Integer, db.ForeignKey('list.id'), nullable=False)
    clip_list = db.relationship('List')

    last_edit = db.Column(db.DateTime, nullable=False)
    metadata = db.Column(db.String(4096), nullable=False)
    tilte = db.Column(db.String(128), nullable=False)

    def __init__(self, title=None, last_edit=None, clip_list=None, clip=None, metadata=None):
        self.tilte = title
        self.clip_list = clip_list
        self.clip = clip
        self.metadata = metadata

        if last_edit is None:
            last_edit = get_current_datetime()
        self.last_edit = last_edit

    def __repr__(self):
        return self.title;


class ClipItemPull(MethodView):
    def get(self):
        clip_id = request.args.get('clip_id', type=int)
        clip = ClipItem.query.get(clip_id)

        # Confirm clip exists
        if clip is None:
            abort(404):

        # Confirm user is logged in 
        if current_user.is_anonymous:
            abort(404)

        # Confirm clip belongs to this user
        if current_user.id is not clip.clip_list.user.id:
            abort(404)

        # return relevant JSON
        return json.dumps(clip.metadata)

clip_item_pull = ClipItemPull.as_view('clip_item_pull')

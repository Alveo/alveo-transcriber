from flask import request

from pyapplication import app, db
from pyapplication.modules.user_model import User

class ClipItemList(UserMixin, db.Model):
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

    def export(self):
        return {
                'title': self.title,
                'last_edit': self.last_edit,
                'items': [
                        
                    ]
            }

class ClipListPull(MethodView):
    def get(self):
        # Confirm user is logged in 
        if current_user.is_anonymous:
            abort(404)

        # return relevant JSON
        # dump all lists, return them
        #return json.dumps(clip.metadata)

class ClipItemListPull(MethodView):
    def get(self):
        clip_list_id = request.args.get('clip_list_id', type=int)
        clip_list = ClipItemList.query.get(clip_list_id)

        # Confirm clip exists
        if clip_list is None:
            abort(404):

        # Confirm user is logged in 
        if current_user.is_anonymous:
            abort(404)

        # Confirm clip belongs to this user
        if current_user.id is not clip_list.user.id:
            abort(404)

        # return relevant JSON
        # get all items, dump their names
        #return json.dumps(clip.metadata)

clip_list_pull = clip_list_pull.as_view('clip_list_pull')
clip_item_list_pull = clip_item_list_pull.as_view('clip_item_list_pull')

import json

from flask import request, abort
from flask.views import MethodView
from flask_login import current_user

from pyapplication import app
from pyapplication.modules.clipitem_model import ClipItem
from pyapplication.modules.cliplist_model import ClipItemList
from pyapplication.modules.user_model import User

class ClipListPull(MethodView):
    def export_items(self, clip_item_list):
        items = ClipItem.query.filter(
                ClipItemList.user==current_user,
                ClipItem.clip_list == clip_item_list,
                ).all()
        exports = []

        for clip_item in items:
            exports += [{
                'id': clip_item.id,
                'title': clip_item.title,
                'data': clip_item.data,
            }]


        return exports

    def export_lists(self):
        lists = ClipItemList.query.filter(User.id==current_user.id).all()
        exports = []

        for clip_list in lists:
            exports += [{
                'id': clip_list.id,
                'title': clip_list.title,
                'last_edit': str(clip_list.last_edit),
                'items': self.export_items(clip_list),
            }]

        return exports

    def get(self):
        # Confirm user is logged in 
        if current_user.is_anonymous:
            abort(404)

        clip_list_id = request.args.get('list_id', type=int)

        clip_list = None 
        if clip_list_id is not None:
            clip_list = ClipItemList.query.get(clip_list_id)

        # Confirm clip exists
        if clip_list is None:
            return json.dumps(self.export_lists()) # Display all lists instead

        return json.dumps(self.export_items(clip_list)) # Display all items from list

clip_list_pull = ClipListPull.as_view('clip_list_pull')

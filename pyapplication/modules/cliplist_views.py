from flask import request
from flask.views import MethodView

from pyapplication import app
from pyapplication.modules.cliplist_model import ClipItemList

class ClipListPull(MethodView):
    def export_items(self, clip_item_list):
        items = ClipItem.query.filter(
                ClipItemList.User.id==current_user.id,
                ClipItemList.id==clip_item_list,
                )
        exports = []

        for clip_item in items:
            export += {
                'id': clip_item.id,
                'title': clip_item.title,
                'data': clip_item.data,
            }

        return exports

    def export_lists(self):
        lists = ClipItemList.query.filter(User.id==current_user.id)
        exports = []

        for clip_list in lists:
            export += {
                'id': clip_list.id,
                'title': clip_list.title,
                'last_edit': clip_list.last_edit,
                'items': self.export_items(clip_list),
            }

        return exports

    def get(self):
        # Confirm user is logged in 
        if current_user.is_anonymous:
            abort(404)

        clip_list_id = request.args.get('clip_list_id', type=int)
        clip_list = ClipItemList.query.get(clip_list_id)

        # Confirm clip exists
        if clip_list is None:
            return json.dumps(export_lists()) # Display all lists instead

        return json.dumps(export_items(clip_list)) # Display all items from list

clip_list_pull = ClipListPull.as_view('clip_list_pull')

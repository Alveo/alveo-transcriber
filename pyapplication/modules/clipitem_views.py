import json
from flask import abort, request

from pyapplication import app
from pyapplication.modules.clipitem_model import ClipItem

class ClipItemPull(MethodView):
    def get(self):
        clip_id = request.args.get('clip_id', type=int)
        clip = ClipItem.query.get(clip_id)

        # Confirm user is logged in 
        if current_user.is_anonymous:
            abort(404)

        # Confirm clip exists
        if clip is None:
            abort(404):

        # Confirm clip belongs to this user
        if current_user.id is not clip.clip_list.user.id:
            abort(404)

        # return relevant JSON
        return json.dumps(clip.metadata)

clip_item_pull = ClipItemPull.as_view('clip_item_pull')

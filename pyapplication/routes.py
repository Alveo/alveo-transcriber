import json
from flask import redirect

# Delay emulation only
import time

from pyapplication import app
from pyapplication.modules.error_views import not_allowed, not_found, server_error
from pyapplication.modules.oauth_views import alveo_authorise_view, alveo_callback_view
from pyapplication.modules.user_views import logout_view
from pyapplication.modules.clipitem_views import clip_item_pull
from pyapplication.modules.cliplist_views import clip_list_pull

# TODO Testing purposes only
from pyapplication.modules.mock_views import mocklogin

app.register_error_handler(403, not_allowed)
app.register_error_handler(404, not_found)
app.register_error_handler(500, server_error)

app.add_url_rule('/app/oa/logout', view_func=logout_view, methods=['GET',])
app.add_url_rule('/app/oa/authorise', view_func=alveo_authorise_view, methods=['GET',])
app.add_url_rule('/app/oa/callback', view_func=alveo_callback_view, methods=['GET',])

app.add_url_rule('/app/mock/login', view_func=mocklogin, methods=['GET',])
app.add_url_rule('/app/clip_item_pull', view_func=clip_item_pull, methods=['GET',])
app.add_url_rule('/app/clip_list_pull', view_func=clip_list_pull, methods=['GET',])

@app.before_first_request
def init():
    pass

@app.route('/')
def serve():
    return redirect('/static/index.html')

@app.route('/request-audio')
def requestaudio():
    return app.send_static_file('sample/audio.ogg')

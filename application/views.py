from flask import url_for

from application import app
from application.modules.transcriber import index_view
from application.modules.oauth import alveo_authorise_view, alveo_callback_view
from application.modules.error import not_allowed,  not_found, server_error

app.register_error_handler(403, not_allowed)
app.register_error_handler(404, not_found)
app.register_error_handler(500, server_error)

app.add_url_rule('/', view_func=index_view, methods=['GET',])
app.add_url_rule('/oauth/authorise', view_func=alveo_authorise_view, methods=['GET',])
app.add_url_rule('/oauth/callback', view_func=alveo_callback_view, methods=['GET',])

@app.before_first_request
def init():
    pass

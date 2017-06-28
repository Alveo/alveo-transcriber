from flask import redirect

from application import app
from application.modules.users import logout_view
from application.modules.oauth import alveo_authorise_view, alveo_callback_view
from application.modules.error import not_allowed, not_found, server_error

app.register_error_handler(403, not_allowed)
app.register_error_handler(404, not_found)
app.register_error_handler(500, server_error)

app.add_url_rule('/app/oa/logout', view_func=logout_view, methods=['GET',])
app.add_url_rule('/app/oa/authorise', view_func=alveo_authorise_view, methods=['GET',])
app.add_url_rule('/app/oa/callback', view_func=alveo_callback_view, methods=['GET',])

@app.before_first_request
def init():
    pass

@app.route('/')
def serve():
    return redirect('/static/index.html')

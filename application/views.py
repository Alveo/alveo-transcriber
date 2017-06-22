from flask import url_for

from application import app
from application.modules.error import not_allowed,  not_found, server_error

app.register_error_handler(403, not_allowed)
app.register_error_handler(404, not_found)
app.register_error_handler(500, server_error)

app.add_url_rule('/', view_func=index, methods=['GET',])

@app.before_first_request
def init():
    pass

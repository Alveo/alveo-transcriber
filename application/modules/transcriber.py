from flask import render_template
from flask.views import MethodView
from flask_login import current_user

from application import db

class IndexView(MethodView):
    def get(self):
        context = {
                "logged_in": not current_user.is_anonymous,
            }

        return render_template('index.html', **context)

index_view = IndexView.as_view('index_view')

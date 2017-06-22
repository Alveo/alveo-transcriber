from flask import render_template
from flask.views import MethodView

from application import db

class IndexView(MethodView):
    def get(self):
        context = {
                }

        return render_template('index.html', **context)

index_view = IndexView.as_view('index_view')

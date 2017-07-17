from flask.views import MethodView
from flask_login import current_user

from pyapplication import app

class LogoutView(MethodView):
    def get(self):
        if not current_user.is_anonymous:
            logout_user(user)

        return app.redirect(app.url_for('index_view'))

logout_view = LogoutView.as_view('logout_view')

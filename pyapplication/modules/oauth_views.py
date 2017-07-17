from flask import redirect, url_for, session, request, flash
from flask.views import MethodView
from flask_login import current_user

from pyapplication import app, oauth_alveo

class AlveoAuthoriseView(MethodView):
    def get(self):
        if not current_user.is_anonymous:
            return redirect(url_for('root'))

        return redirect(oauth_alveo.get_authorize_url(
            scope='email',
            response_type='code',
            redirect_uri=url_for('alveo_callback_view', _external=True)
            )
        )

class AlveoCallbackView(MethodView):
    def get(self):
        if not current_user.is_anonymous:
            return redirect(url_for('root'))

        def callback():
            request_token = session.pop('request_token', None)

            if 'oauth_verifier' not in request.args:
                return None

            oauth_session = oauth_alveo.get_auth_session(
                request_token[0],
                request_token[1],
                data={'oauth_verifier': request.args['oauth_verifier']}
            )

            data = oauth_session.get('account/verify_credentials.json').json()
            oauth_id  = str(data.get('oauth_id'))

            return oauth_id

        oauth_id = callback()

        if oauth_id is None: # No valid oauth_id
            flash('Authentication failed.')
            return redirect(url_for('root'))

        user = User.query.filter_by(oauth_id=oauth_id).first()
        if not user: # Create one
            user = User(oauth_id=oauth_id)
            db.session.add(user)
            db.session.commit()

        login_user(user, True)

        return redirect(url_for('root'))

alveo_authorise_view = AlveoAuthoriseView.as_view('alveo_authorise_view')
alveo_callback_view = AlveoCallbackView.as_view('alveo_callback_view')

import traceback
from threading import Thread

from flask import render_template
from flask_mail import Message

from application import app

# Flask error for 403
def not_allowed(error):
    context = {
            }
    return render_template('403.html', **context), 403

# Flask error for 404
def not_found(error):
    context = {
            }
    return render_template('404.html', **context), 404


def async(f):
    def wrapper(*args, **kwargs):
        thr = Thread(target = f, args = args, kwargs = kwargs)
        thr.start()
    return wrapper

@async
def send_async_email(message):
    with app.app_context():
        app.config['MAILADDR'].send(message)

# Flask error for 500
def server_error(error):
    message = Message(recipients=app.config['ADMINS'], subject=app.config['ERROR_HEADER_500'], body=traceback.format_exc())
    send_async_email(message)

    context = {
            }

    return render_template('500.html', **context), 500

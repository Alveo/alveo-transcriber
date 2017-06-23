import traceback
from threading import Thread

from flask import redirect
from flask_mail import Message

from application import app

# 403 handler
def not_allowed(error):
    return redirect('/')

# 404 handler
def not_found(error):
    return redirect('/')


def async(f):
    def wrapper(*args, **kwargs):
        thr = Thread(target = f, args = args, kwargs = kwargs)
        thr.start()
    return wrapper

@async
def send_async_email(message):
    with app.app_context():
        app.config['MAILADDR'].send(message)

# 500 handler
def server_error(error):
    message = Message(recipients=app.config['ADMINS'], subject=app.config['ERROR_HEADER_500'], body=traceback.format_exc())
    send_async_email(message)

    context = {
            }

    return redirect('/')

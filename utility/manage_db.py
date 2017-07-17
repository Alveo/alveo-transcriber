from datetime import timedelta

from pyapplication import app, db
from pyapplication.modules.user_model import User

def gen_sample():
    db.drop_all()
    db.create_all()

    testUser = User(alias='test')
    db.session.add(testUser)

    db.session.commit();

def gen_blank():
    db.drop_all();
    db.create_all();

    db.session.commit();

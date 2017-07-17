import sys
""" Note that manage.py is used only as utility in production to run the server,
        Gunicorn is used instead so bytecode will be created as expected in
        production and testing environments. """
sys.dont_write_bytecode = True

import getopt
import subprocess

from flask_script import Manager, Command
from flask_migrate import MigrateCommand

from pyapplication import app
import utility.manage_db as alveodb

manager = Manager(app)
manager.add_command('db', MigrateCommand)

@manager.command
def gendb(type):
    if type == "sample":
        alveodb.gen_sample()
        print('Debug: Sample database has been generated.')

    elif type == "blank":
        alveodb.gen_blank()
        print('Debug: Blank database has been generated.')

    else:
        print("Error: unknown database type '"+type+"'")

@manager.command
def build():
    subprocess.call(['./utility/deploy-static.sh'])

@manager.command
def runserver(force=False):
    if app.config['DEBUG'] or force:
        app.run()
    else:
        print("Error: Configuration is not in debug mode and not expected to run through this interface. Please launch via Gunicorn instead or use the --force option.")

if __name__ == '__main__':
    manager.run()

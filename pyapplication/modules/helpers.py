from datetime import datetime
from pytz import timezone

from pyapplication import app

def get_current_datetime():
    return datetime.now(timezone(app.config['TIMEZONE']))

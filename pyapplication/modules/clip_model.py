from pyapplication import app, db

class Clip(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    audio_url = db.Column(db.String(256), nullable=False)
    sample_data = db.Column(db.String(4096), nullable=False)

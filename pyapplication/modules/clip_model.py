from pyapplication import app, db

class Clip(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    audio_url = db.Column(db.String(256), nullable=False)
    sample_data = db.Column(db.String(4096), nullable=False)

    def __init__(self, audio_url=None, sample_data=None):
        self.audio_url = audio_url
        self.sample_data = sample_data

    def __repr__(self):
        return self.audio_url;

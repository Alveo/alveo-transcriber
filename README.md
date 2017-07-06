# alveo-transcriber
Web based speech transcription tool for the Alveo project

# Setup 
(Optional) Set up a virtualenv

Install flask deps
  pip install -r requirements.txt

Install angular deps
  cd alveott
  node install

Build app
  python manage.py gendb sample
  python manage.py build

python manage.py runserver

# Testing/Development
The Angular frontend can be ran from the alveott directory with:
npm start
and, npm test

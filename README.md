# alveo-transcriber
Web based speech transcription tool for the Alveo project

# Setup 
1. (Optional) Set up a virtualenv
2. Install flask deps
  - pip install -r requirements.txt

3. Install angular deps
  - cd alveott
  - node install

4. Build app
  - python manage.py gendb sample
  - python manage.py build

5. python manage.py runserver

# Testing/Development
The Angular frontend can be ran from the alveott directory with:
- npm start
- npm test

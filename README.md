# alveo-transcriber
Web based speech transcription tool for the Alveo project

# Setup 
1. Recommended: Set up a python3 virtual environment

2. Install Flask dependencies
  - pip install -r requirements.txt

3. Install Angular dependencies
  - cd alveott
  - node install

4. Build the application (development)
  - python manage.py gendb sample
  - python manage.py build

5. Run the Flask application (serves the Angular app)
  - python manage.py runserver

# Testing/Development
The AlveoTT frontend can be ran from its directory with:
- npm start
- npm test

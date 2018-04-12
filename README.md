# alveo-transcriber
Web based speech transcription tool for the Alveo project

## Setup 
1. Install dependencies
  - `npm install`

2. Running the application:
  - `npm start`
  - `npm test`

### Building
##### Development
- `npm run`

##### Production
- `npm run-script buildprod`

##### Production (GitHub Pages)
1. `npm run-script buildprod`
2. `cd docs/`
3. `cp index.html 404.html`
  - Copying index.html to 404.html is required until GitHub gets single page application support.

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
- `npm run-script buildprod`
- `cd dist/`
- `cp index.html 404.html`
- Copying index.html to 404.html is required until GitHub gets single page application support.

#!/bin/sh
#  Copying index.html to 404.html is required until GitHub gets single page application support.
echo Running post build script for GitHub pages
cp -v docs/index.html docs/404.html
echo Done

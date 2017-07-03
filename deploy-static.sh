#!/bin/sh

static_dir=$(pwd)/static
app_dir='./alveott/'
app_name='/static/'

echo Purging old static files...
rm -rf $static_dir/*

echo Building app...
cd $app_dir
ng build $@ --aot --base-href $app_name --output-path $static_dir/

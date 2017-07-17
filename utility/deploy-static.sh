#!/bin/bash

set -e

root_dir=$(pwd)
static_dir=$root_dir/static
app_dir=$root_dir/ngapplication
sample_dir=$root_dir/sample
app_href='/static/'

tput setaf 6
echo Purging old static files...
rm -rf $static_dir/*

tput setaf 6
echo Building app...
cd $app_dir
ng build $@ --aot --base-href $app_href --output-path $static_dir/

if [[ $* != *--prod* ]]
then
  tput setaf 6
  echo Copying development samples...
  cp -r $sample_dir $static_dir/
fi

tput setaf 2
echo Static files deployed successfully.
tput sgr0

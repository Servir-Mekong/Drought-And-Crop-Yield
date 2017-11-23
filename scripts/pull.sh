#!/bin/sh

cd /home/rdcyis
git reset --hard HEAD
git pull
gulp build

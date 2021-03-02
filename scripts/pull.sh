#!/bin/bash

source /home/ubuntu/rdcyis_venv/bin/activate
cd /home/ubuntu/rdcyis
git reset --hard HEAD
git pull
python manage.py collectstatic
sudo service supervisor restart
sudo service nginx restart

#!/bin/bash

source /home/ubuntu/mdis_venv/bin/activate
cd /home/ubuntu/mdis
git reset --hard HEAD
git pull
python manage.py collectstatic
sudo service supervisor restart
sudo service nginx restart

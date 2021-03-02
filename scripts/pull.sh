#!/bin/bash

source /home/ubuntu/cdis_venv/bin/activate
cd /home/ubuntu/cdis
git reset --hard HEAD
git pull
python manage.py collectstatic
sudo service supervisor restart
sudo service nginx restart

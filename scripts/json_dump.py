# -*- coding: utf-8 -*-

from jsmin import jsmin
import os

foldername = 'geojson'
os.path.dirname(os.path.dirname(__file__))
path = os.path.join(os.getcwd(), foldername)
path = os.path.abspath(path)
files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]

for file in files:
    print('started file: %s' % file)

    file_path = os.path.join(os.getcwd(), foldername, file)
    with open(file_path, 'r+') as js_file:
        minified = jsmin(js_file.read())
        js_file.seek(0)
        js_file.truncate()
        js_file.write(minified)
        js_file.close()

    print('end file: %s' % file)
    print('**********************')

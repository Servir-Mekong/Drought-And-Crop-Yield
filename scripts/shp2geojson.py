# -*- coding: utf-8 -*-

from json import dumps
import os
from os.path import isfile, join
import shapefile

foldername = 'MK_Basin_LMR2'
os.path.dirname(os.path.dirname(__file__))
path = os.path.join(os.getcwd(), foldername)
path = os.path.abspath(path)
files = [f for f in os.listdir(path) if isfile(join(path, f))]

for file in files:
    if '.shp' in file:
        print('started file: %s' % file)
        file_path = os.path.join(os.getcwd(), foldername, file)
        # read the shapefile
        reader = shapefile.Reader(file_path)
        fields = reader.fields[1:]
        field_names = [field[0] for field in fields]
        buffer = []
        for sr in reader.shapeRecords():
            record = sr.record
            # Make sure everything is utf-8 compatable
            record = [r.decode('utf-8', 'ignore') if isinstance(r, bytes) 
                        else r for r in record]
            atr = dict(zip(field_names, record))
            geom = sr.shape.__geo_interface__
            buffer.append(dict(type='Feature', geometry=geom, properties=atr)) 

        # write the GeoJSON file
        with open('_'.join(file_path.split('.')[:-1]) + '.geo.json', 'w') as geojson:
            geojson.write(dumps({'type': 'FeatureCollection',\
                                    'features': buffer}, indent=2) + '\n')
        print('end file: %s' % file)
        print('**********************')

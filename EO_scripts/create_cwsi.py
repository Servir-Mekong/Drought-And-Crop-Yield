import getopt
import sys
from datetime import datetime, timedelta

import ee

ee.Initialize()

aoi = ee.FeatureCollection("projects/servir-mekong/Lower_mekong_boundary")
aoi = aoi.geometry()


def cwsi(img):
    imgcwsi = img.expression('1 - (ET/PET)', {'ET': img.select('ET'), 'PET': img.select('PET')})
    return img.addBands(imgcwsi.rename("CWSI"))


def doytodate(inputstring):
    parseddate = ee.Date.parse('YYYY-D', inputstring)
    return parseddate.format('YYYY-MM-d')


# def calc_cwsi

def process_cwsi(startdate, historical_run, repository_folder, enddate='0'):
    historical_run = historical_run.capitalize()
    if historical_run == 'True':
        print("Batch")
        s_date = datetime.strptime(startdate, '%Y-%m-%d')
        e_date = datetime.strptime(enddate, '%Y-%m-%d')

        one_data_delta = timedelta(days=8)

        while s_date < e_date:
            s_date += one_data_delta
            if s_date >= e_date:
                break
            date_time = s_date.strftime("%Y_%m_%d")
            # vhi_output = calc_vhi(s_date)

            day_select_start = s_date.timetuple().tm_yday
            current_year = s_date.year
            startdt = doytodate(str(current_year) + '-' + str(day_select_start))
            day_select_end = day_select_start + 8
            enddt = doytodate(str(current_year) + '-' + str(day_select_end))

            out_cwsi = ee.ImageCollection('MODIS/006/MOD16A2').filter(ee.Filter.date(startdt, enddt)).map(cwsi)

            first_scene = ee.Image(out_cwsi.first())
            cwsifile = first_scene.select('CWSI')
            cwsifile = (cwsifile.multiply(1000).int())
            task_order_cwsi = ee.batch.Export.image.toAsset(
                image=cwsifile,
                description='Export_CWSI_' + str(date_time),
                assetId=repository_folder + '/CWSI/cwsi_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:4326',
                maxPixels=10e12)

            etfile = first_scene.select('ET')
            task_order_et = ee.batch.Export.image.toAsset(
                image=etfile,
                description='Export_ET_' + str(date_time),
                assetId=repository_folder + '/ET/et_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:4326',
                maxPixels=10e12)

            petfile = first_scene.select('PET')
            task_order_pet = ee.batch.Export.image.toAsset(
                image=petfile,
                description='Export_PET_' + str(date_time),
                assetId=repository_folder + '/PET/pet_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:4326',
                maxPixels=10e12)

            task_order_cwsi.start()
            # task_order_et.start()
            # task_order_pet.start()
            print("Processing: ", str(date_time))
    else:
        print("Single")
        s_date = datetime.strptime(startdate, '%Y-%m-%d')
        date_time = s_date.strftime("%Y_%m_%d")
        day_select_start = s_date.timetuple().tm_yday
        current_year = s_date.year
        startdt = doytodate(str(current_year) + '-' + str(day_select_start))
        day_select_end = day_select_start + 8
        enddt = doytodate(str(current_year) + '-' + str(day_select_end))

        out_cwsi = ee.ImageCollection('MODIS/006/MOD16A2').filter(ee.Filter.date(startdt, enddt)).map(cwsi)

        first_scene = ee.Image(out_cwsi.first())
        cwsifile = first_scene.select('CWSI')
        cwsifile = (cwsifile.multiply(1000).int())
        task_order_cwsi = ee.batch.Export.image.toAsset(
            image=cwsifile,
            description='Export_CWSI_' + str(date_time),
            assetId=repository_folder + '/CWSI/cwsi_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        etfile = first_scene.select('ET')
        task_order_et = ee.batch.Export.image.toAsset(
            image=etfile,
            description='Export_ET_' + str(date_time),
            assetId=repository_folder + '/ET/et_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        petfile = first_scene.select('PET')
        task_order_pet = ee.batch.Export.image.toAsset(
            image=petfile,
            description='Export_PET_' + str(date_time),
            assetId=repository_folder + '/PET/pet_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        task_order_cwsi.start()
        # task_order_et.start()
        # task_order_pet.start()
        print("Processing: ", str(date_time))
    return "Tasks initiated. Check EE Tasks for their status."


def main(argument):
    # Options
    input_date_start = ''
    input_date_end = ''
    batch_process = ''
    input_repository_name = ''
    # input_area_of_interest = ''

    options = "hs:e:b:d:"

    # Long options
    long_options = ["Help", "SDate = ", "EDate = ", "Batch = ", "EEAsset ="]

    try:
        # Parsing argument
        arguments, values = getopt.getopt(argument, options, long_options)
    except getopt.error as err:
        # output error, and return with an error code
        print(str(err))
        print("refer help:       python create_indices.py -h")

    # checking each argument
    for currentArgument, currentValue in arguments:
        if currentArgument in ("-h", "--Help"):
            print(''' 
            Help for creating CWSI from 8 Day MODIS ET product using Google Earth Engine (GEE).
            Outputs are saved in the designated GEE asset folder, wherein each index is saved in its sub-folder.

            python create_cwsi.py -b batch -s startdate -e enddate -d Output/folder/path 
            for batch:
            python create_cwsi.py -b True -s 2018-01-01 -e 2018-01-31 -d users/seiasia/internal_SERVIR
            for one day:
            python D:\Github_SEI\python\servir_drought\create_cwsi.py -b False -s 2018-06-01 -d users/seiasia/internal_SERVIR
            
            where,
            -s, -SDate     Date to start processing from e.g. 2011-01-01
            -e, -EDate     Date to end processing from e.g. 2012-01-31, NOTE: This is required only in case 
                           where historical processing is selected
            -b, -Batch     if historical data processing then True. if processing for a single date then False
            -d, -EEAsset   Location to save in GEE asset. It will append processed scene in corresponding
                           image collection (see Note). e.g. projects/servir-mekong/EODrought 
                           NOTE:Please create image collection/folder named CWSI (also for ET and PET check script) 
                           at this folder location
            ''')
            sys.exit()

        elif currentArgument in ("-b", "--Batch"):
            batch_process = currentValue  # e.g. True or False
        elif currentArgument in ("-s", "--SDate"):
            input_date_start = currentValue  # e.g. '2011-01-01'
        elif currentArgument in ("-e", "--EDate"):
            input_date_end = currentValue  # e.g. '2011-01-01'
        elif currentArgument in ("-d", "--EEAsset"):
            input_repository_name = currentValue  # e.g. "projects/servir-mekong/EODrought"

    # print('input_date_end', input_date_end)
    # print('input_repository_name', input_repository_name)
    output = process_cwsi(input_date_start, batch_process, input_repository_name, enddate=input_date_end)
    print(output)


if __name__ == '__main__':
    main(sys.argv[1:])
    # startdate = '2020-03-01'
    # enddate = '2020-03-18'
    # historical_run = 'True'
    # output = process_cwsi(startdate, historical_run, repository_folder='users/seiasia/internal_SERVIR', enddate=enddate)

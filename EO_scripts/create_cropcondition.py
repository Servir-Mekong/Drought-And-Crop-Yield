import getopt
import sys
from datetime import datetime, timedelta

import ee

# ee.Authenticate()
ee.Initialize()

# table = ee.FeatureCollection("users/seiasia/servir_mk/NinhThuan_province")
lmc = ee.FeatureCollection("projects/servir-mekong/Lower_mekong_boundary")
aoi = lmc.geometry()  # table.geometry()


def rescaling(img):
    inp = img.clip(aoi)
    return inp.multiply(0.0001).copyProperties(img, ['system:time_start', 'system:time_end'])


def doytodate(inputstring):
    parseddate = ee.Date.parse('YYYY-D', inputstring)
    return parseddate.format('YYYY-MM-d')


def datetodoy(inputstring):
    parseddate = ee.Date.parse('YYYY-MM-d', inputstring)
    return parseddate.format('D')


def doytodateformat(inputstring):
    parseddate = ee.Date.parse('YYYY-D', inputstring)
    return parseddate


def calc_newcrop(inp_ic, input_image_date):
    inp_dt = input_image_date
    ninp_dt = input_image_date.advance(-8.0, 'day')
    inp_startdt = ninp_dt.advance(-24.0, 'day')
    baseimg = inp_ic.filterDate(inp_startdt, ninp_dt).select('NDVI')\
        .map(rescaling).mean().rename("precondition")
    currimg = inp_ic.filterDate(inp_dt, inp_dt.advance(1.0, 'day'))\
        .select('NDVI').map(rescaling).first().rename("currentNDVI")
    previmg = inp_ic.filterDate(ninp_dt, ninp_dt.advance(1.0, 'day'))\
        .select('NDVI').map(rescaling).first().rename("previousweek")
    currdiff = baseimg.subtract(currimg)
    prevdiff = baseimg.subtract(previmg)
    differnce = (currdiff.lt(-0.2).And(prevdiff.lt(-0.2))).rename("new_crop")
    return currimg.addBands(differnce).copyProperties(currimg, ['system:time_start', 'system:time_end'])


def reclassanomly(image):
    imgNI = image.expression(
        '(b < -1) ? 0 \
        : (b <= -0.5) ? 1 \
        : (b <= -0.2) ? 2\
        : (b <= 0) ? 3 \
        : (b <= 0.2) ? 4 \
        : (b > 0.2) ? 5\
        : 0',
        {'b': image.select('NDVI')})
    outimage = (imgNI.neq(0))
    outputim = (imgNI.updateMask(outimage)).rename("NDAnomalyclass")
    return outputim.copyProperties(image, ['system:time_start',
                                           'system:time_end'])  # (imgNI.updateMask(outimage)).rename("NDAnomalyclass")


def calc_crop_condition(date_formatted):
    day_select_start = date_formatted.timetuple().tm_yday
    current_year = date_formatted.year
    # print("within code")
    # print(day_select_start)
    # print(current_year)
    # doys=ee.List.sequence({start:1,end:365,step:8})
    # day_select_start = 361  # This is Day of year
    # current_year = 2018

    hist_year_start = current_year - 1
    hist_year_end = hist_year_start - 5  # Past five years of data is considered

    dataset = ee.ImageCollection("NOAA/VIIRS/001/VNP13A1")

    # users/seiasia/servir_mk/LandCovMask500_2018
    if current_year <= 2018:
        # featu = "users/seiasia/servir_mk/LandCovMask500_" + str(current_year)
        featu = "projects/servir-mekong/EODrought/Rice_landCov_mask/landcov_" + str(current_year)
    else:
        # featu = "users/seiasia/servir_mk/LandCovMask500_2018"
        featu = "projects/servir-mekong/EODrought/Rice_landCov_mask/landcov_2018"
    rice = ee.Image(featu).select("lc")

    col = dataset.filter(ee.Filter.calendarRange(hist_year_end, hist_year_start, 'year')) \
        .filter(ee.Filter.calendarRange(day_select_start, day_select_start + 1, 'day_of_year')) \
        .select('NDVI').map(rescaling).mean()  # .set('DAY_OF_YEAR', m)

    stDate = doytodateformat(str(current_year) + '-' + str(day_select_start))

    # aab = ee.Image(calc_newcrop(dataset, stDate))

    currimge = dataset.filterDate(stDate, stDate.advance(1.0, 'day'))\
        .select('NDVI').map(rescaling).first().rename("currentNDVI")
    hist_mean = col  # ltmean.filter(ee.Filter.eq('DAY_OF_YEAR', ee.Number.parse(day_select_start))).first()
    nd_anomaly = (hist_mean.subtract(ee.Image(currimge.select('currentNDVI'))).mask(rice))\
        .copyProperties(currimge, ['system:time_start', 'system:time_end'])
    classified = reclassanomly(ee.Image(nd_anomaly))
    return classified


def process_crop_condition(startdate, historical_run, repository_folder, enddate='0'):
    historical_run = historical_run.capitalize()
    if historical_run == 'True':
        print("Batch")
        s_date = datetime.strptime(startdate, '%Y-%m-%d')
        e_date = datetime.strptime(enddate, '%Y-%m-%d')
        one_data_delta = timedelta(days=8)

        while s_date < e_date:
            if s_date >= e_date:
                break
            date_time = s_date.strftime("%Y_%m_%d")
            crp_condition = calc_crop_condition(s_date)
            first_scene = ee.Image(crp_condition).select('NDAnomalyclass') #.first()
            task_order_cc = ee.batch.Export.image.toAsset(
                image=first_scene,#ee.Image(crp_condition.select('NDAnomalyclass')),
                description='Export_CC_' + str(date_time),
                assetId=repository_folder + '/CropCondition/cc_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:3857', #'EPSG:4326',
                maxPixels=10e12)
            task_order_cc.start()
            print("Processing: ", str(date_time))
            s_date += one_data_delta
    else:
        print("Single")
        s_date = datetime.strptime(startdate, '%Y-%m-%d')
        crp_condition = calc_crop_condition(s_date)
        date_time = s_date.strftime("%Y_%m_%d")
        first_scene = ee.Image(crp_condition).select('NDAnomalyclass')
        task_order_cc = ee.batch.Export.image.toAsset(
            image=first_scene,#crp_condition.select('NDAnomalyclass'),
            description='Export_CC_' + str(date_time),
            assetId=repository_folder + '/CropCondition/cc_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:3857',#'EPSG:4326', # to match with RLCMS LULC Projection
            maxPixels=10e12)
        task_order_cc.start()
        print("Processing: ", str(date_time))
    return "Tasks initiated. Check EE Tasks for their status."


def main(argument):
    # Options
    input_date_start = ''
    input_date_end = ''
    batch_process = ''
    input_repository_name = ''

    options = "hs:e:b:d:"

    # Long options
    long_options = ["Help", "SDate = ", "EDate = ", "Batch = ", "EEAsset ="]

    try:
        # Parsing argument
        arguments, values = getopt.getopt(argument, options, long_options)
    except getopt.error as err:
        # output error, and return with an error code
        print(str(err))
        print("refer help:       python create_cropcondition.py -h")

    # checking each argument
    for currentArgument, currentValue in arguments:
        if currentArgument in ("-h", "--Help"):
            print(''' 
            Help for creating Crop Condition from 8 Day VIIRS using Google Earth Engine (GEE).
            Outputs are saved in the designated GEE asset folder, wherein each index is saved in its sub-folder.

            python create_cropcondition.py -b batch -s startdate -e enddate -d Output/folder/path 
            for batch:
            python create_cropcondition.py -b True -s 2018-01-01 -e 2018-01-31 -d users/seiasia/internal_SERVIR
            for one day:
            python D:\Github_SEI\python\servir_drought\create_cropcondition.py -b False -s 2018-06-01 -d users/seiasia/internal_SERVIR
            
            where,
            -s, -SDate     Date to start processing from e.g. 2011-01-01
            -e, -EDate     Date to end processing from e.g. 2012-01-31, NOTE: This is required only in case 
                           where historical processing is selected
            -b, -Batch     if historical data processing then True. if processing for a single date then False
            -d, -EEAsset   Location to save in GEE asset. It will append processed scene in corresponding
                           image collection (see Note).  e.g. projects/servir-mekong/EODrought 
            NOTE: PLEASE CREATE A FOLDER/IMAGE COLLECTION NAMED 'CropCondition' WITHIN THE REPOSITORY PATH 
            MENTIONED IN -d IN CASE NOT PRESENT
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

    output = process_crop_condition(input_date_start, batch_process, input_repository_name, enddate=input_date_end)
    print(output)


if __name__ == '__main__':
    # main(sys.argv[1:])
    # '''
    # For Batch run
    # python D:\Github_SEI\python\servir_drought\create_cropcondition.py -b True -s 2018-01-01 -e 2018-01-31 -d projects/servir-mekong/EODrought/VIIRS
    # For Single run
    # python D:\Github_SEI\python\servir_drought\create_cropcondition.py -b False -s 2018-06-01 -d projects/servir-mekong/EODrought/VIIRS
    # '''

    # # Desktop run
    startdate = '2021-01-01'
    enddate = '2021-10-31'
    historical_run = 'True'
    output = process_crop_condition(startdate,
                                    historical_run,
                                    repository_folder='projects/servir-mekong/EODrought/VIIRS', #'users/seiasia/servir_mk',
                                    enddate=enddate)
    # #'projects/servir-mekong/EODrought/VIIRS',#'users/seiasia/servir_mk' 'projects/servir-mekong/EODrought/MODIS' users/seiasia/servir_mk/CropCondition


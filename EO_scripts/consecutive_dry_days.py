import getopt
import sys
from datetime import datetime, timedelta

import ee

# ee.Authenticate()
ee.Initialize()

aoi = ee.FeatureCollection("projects/servir-mekong/Lower_mekong_boundary")
aoi = aoi.geometry()


def temp_class_vhi(image):
    interimop = image.select('VHI').multiply(0.01).lt(20).multiply(8)
    return interimop.copyProperties(image, ['system:time_start', 'system:time_end'])


# Function to calculate length of consecutive days
def consecutiveDays(this_img, cum_prev_max):
    cum_img = ee.Image(cum_prev_max).select(0)  # load cumulative # days
    prev_img = ee.Image(cum_prev_max).select(1)  # load prev day's image
    max_run = ee.Image(cum_prev_max).select(2)  # load maximum # consecutive data
    this_img = this_img.unmask()  # set masked pixels to 0
    cum_img = cum_img.where(this_img.eq(8).And(prev_img.eq(8)), cum_img.add(8))
    cum_img = cum_img.where(this_img.neq(8), 0)  # if > 20, reset counter
    max_run = max_run.where(cum_img.gt(max_run), cum_img)
    return cum_img.addBands(this_img).addBands(max_run)


def calc_startdate(start_d, days):
    e_date = datetime.strptime(start_d, '%Y-%m-%d') + timedelta(
        days=1)  # add one date so that image of that end date is included
    s_date = e_date - timedelta(days=days)
    inp_endd = e_date.strftime("%Y-%m-%d")
    inp_startd = s_date.strftime("%Y-%m-%d")
    return inp_startd, inp_endd


def calc_conse_dry_days(inp_ic_path, start_date, num_of_days, repository_folder, inp_index):

    inp_startdt, inp_enddt = calc_startdate(start_date, num_of_days)

    # convert data to binary based on threshold
    if inp_index == 'VHI':
        inp_ic = ee.ImageCollection(inp_ic_path)
        temp_ic = inp_ic.filterDate(inp_startdt, inp_enddt)

        lastimg = temp_ic.limit(1, 'system:time_start', False).first()
        endDateNum = lastimg.get('system:time_start')
        py_date = datetime.utcfromtimestamp(endDateNum.getInfo() / 1000.0)
        e_date_databased = py_date.strftime("%Y-%m-%d")
        inp_startdt, inp_enddt = calc_startdate(e_date_databased, num_of_days)
        temp_ic = None

        selected_modis = inp_ic.filterDate(inp_startdt, inp_enddt)
        vhi_high = selected_modis.map(temp_class_vhi)
    else:
        print("Incorrect index name. Please check")

    num_images = vhi_high.size()  # each scene is corresponding to 8 days
    vhi_high = ee.ImageCollection(vhi_high.toList(num_images))

    cumul = ee.Image(vhi_high.iterate(consecutiveDays, ee.Image([0, 0, 0]))).select(0).selfMask()  # .add(8)#.clip(aoi)

    startdate = ee.Date(endDateNum).advance(-abs(num_of_days), 'day')
    startDateNum = startdate.millis()
    date_time = py_date.strftime("%Y_%m_%d")

    drydays = cumul.set('system:time_start', startDateNum, 'system:time_end', endDateNum)

    task_order = ee.batch.Export.image.toAsset(
        image=drydays,
        description='Export_dd_' + str(date_time),
        assetId=repository_folder + '/MODIS/dry_days_vhi/dd_' + str(date_time),
        region=aoi.bounds().getInfo()['coordinates'][0],
        scale=500,
        crs='EPSG:4326',
        maxPixels=10e12)
    task_order.start()
    print('processing:', date_time)


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
        print("refer help:       python create_indices.py -h")

    # checking each argument
    for currentArgument, currentValue in arguments:
        if currentArgument in ("-h", "--Help"):
            print(''' 
            Help for calculating 48-day dry period from 8 Day VHI product using Google Earth Engine (GEE).
            Outputs are saved in the designated GEE asset folder /MODIS/dry_days_vhi
            
            python consecutive_dry_days.py -b batch -s startdate -e enddate -d Output/folder/path 
            
            for batch:
            python consecutive_dry_days.py -b True -s 2018-01-01 -e 2018-01-31 -d projects/servir-mekong/EODrought
            for one day:
            python D:\Github_SEI\python\servir_drought\cconsecutive_dry_days.py -b False -s 2018-06-01 -d projects/servir-mekong/EODrought
            
            where,
            -s, -SDate     Date to start processing from e.g. 2011-01-01
            -e, -EDate     Date to end processing from e.g. 2012-01-31, NOTE: This is required only in case 
                           where historical processing is selected
            -b, -Batch     if historical data processing then True. if processing for a single date then False
            -d, -EEAsset   Location to save in GEE asset. It will append processed scene in corresponding
                           image collection (see Note). e.g. projects/servir-mekong/EODrought 
                           NOTE:Please create image collection/folder named 'EODrought/MODIS/dry_days_vhi'
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

    # 48/8 = 6 images of 8day repitivity are considered.
    # In some cases like January 7 scenes are present because of one more scene at EOY
    days = 48
    vhi_ic = "projects/servir-mekong/EODrought/MODIS/VHI"

    if batch_process:  # if batch_process == 'batch':
        s_dat = datetime.strptime(input_date_start, '%Y-%m-%d')
        edat = datetime.strptime(input_date_end, '%Y-%m-%d')
        while abs((s_dat - edat).days) > 7:
            startdate_n = s_dat.strftime("%Y-%m-%d")
            calc_conse_dry_days(vhi_ic, startdate_n, days, input_repository_name, 'VHI')
            s_dat = s_dat + timedelta(days=8)
    else:
        calc_conse_dry_days(vhi_ic, input_date_start, days, input_repository_name, 'VHI')
    # print("Done")


if __name__ == '__main__':
    main(sys.argv[1:])
    # python D:\Github_SEI\python\servir_drought\consecutive_dry_days.py -b True -s 2019-01-09 -e 2020-01-31 -d projects/servir-mekong/EODrought

    # input_date_start = '2018-01-01'
    # input_date_end = '2018-03-31'
    # input_repository_name = 'projects/servir-mekong/EODrought'
    # batch_process = 'batch'
    #
    # days = 48
    # vhi_ic = "projects/servir-mekong/EODrought/MODIS/VHI"
    #
    # if batch_process == 'batch':
    #     s_dat = datetime.strptime(input_date_start, '%Y-%m-%d')
    #     edat = datetime.strptime(input_date_end, '%Y-%m-%d')
    #     while abs((s_dat - edat).days) > 7:
    #         print(s_dat)
    #         # s_date = datetime.strptime(startdate, '%Y-%m-%d')
    #         startdate_n = s_dat.strftime("%Y-%m-%d")
    #         calc_conse_dry_days(vhi_ic, startdate_n, days, input_repository_name, 'VHI')
    #         s_dat = s_dat + timedelta(days=8)
    # else:
    #     calc_conse_dry_days(vhi_ic, input_date_start, days, input_repository_name, 'VHI')
    # print("Done")

import getopt
import sys
from datetime import datetime, timedelta

import ee

# ee.Authenticate()
ee.Initialize()

modislandcov = ee.ImageCollection('MODIS/006/MCD12Q1')
aoi = ee.FeatureCollection("projects/servir-mekong/Lower_mekong_boundary")
aoi = aoi.geometry()


def doytodate(inputstring):
    parseddate = ee.Date.parse('YYYY-D', inputstring)
    return parseddate.format('YYYY-MM-d')


def joinCollections(c1, c2):
    innerJoin = ee.Join.inner()
    filterTimeEq = ee.Filter.equals(leftField='system:time_start', rightField='system:time_start')
    innerJoined = innerJoin.apply(c1, c2, filterTimeEq)
    joined = innerJoined.map(lambda feature: ee.Image.cat(feature.get('primary'), feature.get('secondary')))
    return ee.ImageCollection(joined)


def VHI(image):
    imgVHI = image.expression('(0.5 * TCI) + (0.5 * VCI)',
                              {'TCI': image.select('TCI'),
                               'VCI': image.select('VCI')})
    return imgVHI.rename("VHI")


def addNDVI(image):
    ndvi = image.normalizedDifference(['sur_refl_b02', 'sur_refl_b01'])
    return image.addBands(ndvi.rename("ndvi"))


def getQABits(image):
    pattern = 0
    start = 0
    end = 1
    newName = 'cloudmask'

    for i in range(start, end + 1):
        value = pow(2, i)
        pattern = pattern + value
    return image.select([0], [newName]).bitwiseAnd(pattern).rightShift(start)


def maskClouds(image):
    QA = image.select('StateQA')  # QA = image.select('QC_250m')
    internalCloud = getQABits(QA)
    return image.updateMask(internalCloud.eq(0))


def maskClouds_lst(image):
    QA = image.select('QC_Day')  # QA = image.select('QC_250m')
    internalCloud = getQABits(QA)
    return image.updateMask(internalCloud.eq(0))


def merge_terra_aqua(inp_collection, st_yr, end_yr, st_date, ed_date, temporalResolution):
    his_start = doytodate(str(st_yr) + '-' + str(st_date))
    his_end = doytodate(str(end_yr) + '-' + str(ed_date))
    diff = ee.Date(his_end).difference(his_start, 'day')
    # range = ee.List.sequence(0, diff.subtract(1)).map(function(day){return ee.Date(his_start).advance(day, 'day')});
    range = ee.List.sequence(0, diff.subtract(1)).map(lambda day: ee.Date(his_start).advance(day, 'day'))

    def day_mosaics(date, newlist):
        date = ee.Date(date)
        newlist = ee.List(newlist)
        # date_formatted = ee.Number.parse(date.format('YYYYMMdd'))
        # dateband = ee.Image.constant(date_formatted).toUint32().rename('date')
        filtered = inp_collection.filterDate(date, date.advance(temporalResolution, 'day'))
        image = (ee.Image(filtered.mosaic()) \
                 .copyProperties((filtered.first()), ['system:time_start', 'system:footprint']) \
                 .copyProperties(filtered.first()))
        return ee.List(ee.Algorithms.If(filtered.size(), newlist.add(image), newlist))

    return (ee.ImageCollection(ee.List(range.iterate(day_mosaics, ee.List([])))))


def lst_scale(image):
    imgrescale = image.expression('(0.02 * lst)',
                                  {'lst': image.select('LST_Day_1km'), })
    rescaled = imgrescale.rename("lst_rescaled_1km")
    return image.addBands(rescaled)  # image.multiply(0.02);


def reclassvhi(image):
    imgI = image.expression(
        '(b < -10) ? 0 \
        : (b <= 10) ? 5 \
        : (b <= 20) ? 4\
        : (b <= 30) ? 3 \
        : (b <= 40) ? 2 \
        : (b <= 150) ? 1\
        : 0',
        {'b': image.select('VHI')})
    outimage = (imgI).neq(0)
    return image.addBands((imgI.updateMask(outimage)).rename("VHIclass"))


def calc_vhi(date_formatted):
    day_select_start = date_formatted.timetuple().tm_yday
    current_year = date_formatted.year
    historicalstartyr = 2000  # as start period for min and max images
    historical_endyr = current_year - 1
    startdt = doytodate(str(current_year) + '-' + str(day_select_start))
    day_select_end = day_select_start + 8
    enddt = doytodate(str(current_year) + '-' + str(day_select_end))

    mod09 = ee.ImageCollection('MODIS/006/MOD09A1').filter(ee.Filter.date(startdt, enddt)).map(maskClouds).map(addNDVI)
    myd09 = ee.ImageCollection("MODIS/006/MYD09A1").filter(ee.Filter.date(startdt, enddt)).map(maskClouds).map(addNDVI)

    mod11 = ee.ImageCollection('MODIS/006/MOD11A2').filter(ee.Filter.date(startdt, enddt)).map(maskClouds_lst)
    myd11 = ee.ImageCollection('MODIS/006/MYD11A2').filter(ee.Filter.date(startdt, enddt)).map(maskClouds_lst)

    mod09_his = ee.ImageCollection('MODIS/006/MOD09A1') \
        .filter(ee.Filter.calendarRange(historicalstartyr, historical_endyr, 'year')) \
        .filter(ee.Filter.calendarRange(day_select_start, day_select_end, 'day_of_year')) \
        .map(maskClouds).map(addNDVI)
    myd09_his = ee.ImageCollection("MODIS/006/MYD09A1") \
        .filter(ee.Filter.calendarRange(historicalstartyr, historical_endyr, 'year')) \
        .filter(ee.Filter.calendarRange(day_select_start, day_select_end, 'day_of_year')) \
        .map(maskClouds).map(addNDVI)

    mod11_his = ee.ImageCollection('MODIS/006/MOD11A2') \
        .filter(ee.Filter.calendarRange(historicalstartyr, historical_endyr, 'year')) \
        .filter(ee.Filter.calendarRange(day_select_start, day_select_end, 'day_of_year')) \
        .map(maskClouds_lst)
    myd11_his = ee.ImageCollection("MODIS/006/MYD11A2") \
        .filter(ee.Filter.calendarRange(historicalstartyr, historical_endyr, 'year')) \
        .filter(ee.Filter.calendarRange(day_select_start, day_select_end, 'day_of_year')) \
        .map(maskClouds_lst)

    veg_merged = mod09.merge(myd09)
    temp_merged = mod11.merge(myd11)

    veg = merge_terra_aqua(veg_merged, current_year, current_year, day_select_start, day_select_end,
                           1)  # here 1 = 1 day
    temp = merge_terra_aqua(temp_merged, current_year, current_year, day_select_start, day_select_end, 1)
    temp = temp.map(lst_scale)

    newcollec = joinCollections(veg, temp)

    veg_merged = mod09_his.merge(myd09_his)
    temp_merged = mod11_his.merge(myd11_his)

    his_veg = merge_terra_aqua(veg_merged, historicalstartyr, historical_endyr, day_select_start, day_select_end,
                               8)  # here. 8 = 8 days iterations
    his_temp = merge_terra_aqua(temp_merged, historicalstartyr, historical_endyr, day_select_start, day_select_end, 8)
    his_temp = his_temp.map(lst_scale)

    newcollec_his = joinCollections(his_veg, his_temp)

    maximage_ndvi = (newcollec_his.select("ndvi")).max()  # this is hardcoded variable for VCI function
    minimage_ndvi = (newcollec_his.select("ndvi")).min()  # this is hardcoded variable for VCI function
    maximage_lst = (newcollec_his.select("lst_rescaled_1km")).max()  # this is hardcoded variable for TCI function
    minimage_lst = (newcollec_his.select("lst_rescaled_1km")).min()  # this is hardcoded variable for TCI function

    def TCI(image):
        imgTCI = image.expression('100 * ((maximum - current) / (maximum - minimum))',
                                  {'current': image.select("lst_rescaled_1km"),
                                   'maximum': maximage_lst,
                                   'minimum': minimage_lst, })
        return imgTCI.rename("TCI")

    def VCI(image):
        imgVCI = image.expression('100 * ((current - minimum) / (maximum - minimum))',
                                  {'current': image.select('ndvi'),
                                   'maximum': maximage_ndvi,
                                   'minimum': minimage_ndvi, })
        return imgVCI.rename("VCI")

    out_VCI = newcollec.map(VCI)
    out_TCI = newcollec.map(TCI)

    combinestack = out_VCI.combine(out_TCI)
    out_VHI = combinestack.map(VHI)
    finaloutput = combinestack.combine(out_VHI)
    finaloutput = finaloutput.map(reclassvhi)  # adds classified layer
    return finaloutput


def process_vhi(startdate, historical_run, repository_folder, enddate='0'):
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
            vhi_output = calc_vhi(s_date)
            first_scene = ee.Image(vhi_output.first())

            # vhireclassed = first_scene.select('VHIclass')
            # task_order_vhi_reclass = ee.batch.Export.image.toAsset(
            #     image=vhireclassed,
            #     description='Export_VHI_recl_' + str(date_time) ,
            #     assetId= repository_folder + '/VHI_reclass/vhi_reclass_' + str(date_time),
            #     # repository_name + "/" + outputsubfolder + "/ARVI/ARVI_" + i,
            #     region=aoi.bounds().getInfo()['coordinates'][0],
            #     scale=500,
            #     crs='EPSG:4326',
            #     maxPixels=10e12)
            vhifile = first_scene.select('VHI')
            vhifile = (vhifile.multiply(100).int())
            task_order_vhi = ee.batch.Export.image.toAsset(
                image=vhifile,
                description='Export_VHI_' + str(date_time),
                assetId=repository_folder + '/VHI/vhi_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:4326',
                maxPixels=10e12)
            vcifile = first_scene.select('VCI')
            landsea = (modislandcov.select('LW')).first()
            vcifile = vcifile.updateMask(landsea.eq(2))  # Masking Sea area
            vcifile = (vcifile.multiply(100).int())
            task_order_vci = ee.batch.Export.image.toAsset(
                image=vcifile,
                description='Export_VCI_' + str(date_time),
                assetId=repository_folder + '/VCI/vci_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:4326',
                maxPixels=10e12)
            tcifile = first_scene.select('TCI')
            tcifile = (tcifile.multiply(100).int())
            task_order_tci = ee.batch.Export.image.toAsset(
                image=tcifile,
                description='Export_TCI_' + str(date_time),
                assetId=repository_folder + '/TCI/tci_' + str(date_time),
                region=aoi.bounds().getInfo()['coordinates'][0],
                scale=500,
                crs='EPSG:4326',
                maxPixels=10e12)
            # task_order_vhi_reclass.start()
            task_order_vhi.start()
            task_order_vci.start()
            task_order_tci.start()
            print("Processing: ", str(date_time))
    else:
        print("Single")
        s_date = datetime.strptime(startdate, '%Y-%m-%d')
        vhi_output = calc_vhi(s_date)
        date_time = s_date.strftime("%Y_%m_%d")
        first_scene = ee.Image(vhi_output.first())

        # vhireclassed = first_scene.select('VHIclass')
        # task_order_vhi_reclass = ee.batch.Export.image.toAsset(
        #     image=vhireclassed,
        #     description='Export_VHI_recl_' + str(date_time),
        #     assetId=repository_folder + '/VHI_reclassified/vhi_reclass_' + str(date_time),
        #     # 'users/seiasia/internal_SERVIR/vhi_reclass/VHI_reclass_' + str(date_time),
        #     # repository_name + "/" + outputsubfolder + "/ARVI/ARVI_" + i,
        #     region=aoi.bounds().getInfo()['coordinates'][0],
        #     scale=500,
        #     crs='EPSG:4326',
        #     maxPixels=10e12)
        vhifile = first_scene.select('VHI')
        vhifile = (vhifile.multiply(100).int())
        task_order_vhi = ee.batch.Export.image.toAsset(
            image=vhifile,
            description='Export_VHI_' + str(date_time),
            assetId=repository_folder + '/VHI/vhi_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)
        vcifile = first_scene.select('VCI')
        landsea = (modislandcov.select('LW')).first()
        vcifile = vcifile.updateMask(landsea.eq(2))  # Masking Sea area
        vcifile = (vcifile.multiply(100).int())
        task_order_vci = ee.batch.Export.image.toAsset(
            image=vcifile,
            description='Export_VCI_' + str(date_time),
            assetId=repository_folder + '/VCI/vci_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)
        tcifile = first_scene.select('TCI')
        tcifile = (tcifile.multiply(100).int())
        task_order_tci = ee.batch.Export.image.toAsset(
            image=tcifile,
            description='Export_TCI_' + str(date_time),
            assetId=repository_folder + '/TCI/tci_' + str(date_time),
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        # task_order_vhi_reclass.start()
        task_order_vhi.start()
        task_order_vci.start()
        task_order_tci.start()
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
            Help for creating VCI, TCI and VHI from 8 Day MODIS (Terra + Aqua) using Google Earth Engine (GEE).
            Outputs are saved in the designated GEE asset folder, wherein each index is saved in its sub-folder.

            python create_vhi_modis.py -b batch -s startdate -e enddate -d Output/folder/path 
            for batch:
            python create_vhi_modis.py -b True -s 2018-01-01 -e 2018-01-31 -d users/seiasia/internal_SERVIR
            for one day:
            python D:\Github_SEI\python\servir_drought\create_vhi_modis.py -b False -s 2018-06-01 -d users/seiasia/internal_SERVIR
            
            where,
            -s, -SDate     Date to start processing from e.g. 2011-01-01
            -e, -EDate     Date to end processing from e.g. 2012-01-31, NOTE: This is required only in case 
                           where historical processing is selected
            -b, -Batch     if historical data processing then True. if processing for a single date then False
            -d, -EEAsset   Location to save in GEE asset. It will append processed scene in corresponding
                           image collection (see Note).  e.g. projects/servir-mekong/EODrought 
                           NOTE:Please create image collection/folder named VCI,TCI, VHI at this folder location
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
    output = process_vhi(input_date_start, batch_process, input_repository_name, enddate=input_date_end)
    print(output)


if __name__ == '__main__':
    main(sys.argv[1:])
    '''
    For Batch run
    python D:\Github_SEI\python\servir_drought\create_vhi_modis.py -b True -s 2018-01-01 -e 2018-01-31 -d users/seiasia/internal_SERVIR
    For Single run
    python D:\Github_SEI\python\servir_drought\create_vhi_modis.py -b False -s 2018-06-01 -d users/seiasia/internal_SERVIR
    '''
    # startdate = '2020-04-01'
    # enddate = '2020-04-18'
    # historical_run = 'True'
    # output = process_vhi(startdate, historical_run, repository_folder = 'users/seiasia/internal_SERVIR', enddate=enddate)

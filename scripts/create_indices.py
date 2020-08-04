import getopt
import sys
# from datetime import date

import ee

ee.Initialize()


def lst_scale(image):
    selectband = (image.select('LST_Day_1km')).multiply(0.02)
    return image.addBands(selectband.rename('LST_Day_1km_rescaled'))


def calc_msi(swirband, nirband):
    interim_output = swirband.divide(nirband)
    return (interim_output.multiply(10000)).int().rename('MSI')


def calc_arvi(nirband, redband, blueband):
    interimoutput = redband.subtract((blueband.subtract(redband)).multiply(1.0))
    output = (nirband.subtract(interimoutput)).divide((nirband.add(interimoutput)))
    return (output.multiply(10000)).int().rename('ARVI')


def calc_savi(nirband, redband):
    savi = (nirband.subtract(redband)).divide((nirband.add(redband)).add(0.5))
    return (savi.multiply(10000)).int().rename('SAVI')


def calc_vsdi_rescaled(img, swirband, redband, blueband):
    imgvsdi = img.expression('1.0 - ((swir * 0.0001)  - (blue* 0.0001) + ((red* 0.0001) - (blue* 0.0001)))', {
        'swir': img.select(swirband),
        'red': img.select(redband),
        'blue': img.select(blueband)})
    return (imgvsdi.multiply(10000)).int().rename("VSDI")


def maskVIIRS(img):
    qualitymask1 = img.select('pixel_reliability')
    masked = img.updateMask(qualitymask1.lte(2))
    return masked.copyProperties(img, ['system:time_start', 'system:time_end'])


def maskMOD09(img):
    quality = img.select('StateQA')
    newMask = img.And(quality.bitwiseAnd(1).eq(0)).And(quality.bitwiseAnd(2).eq(0)) \
        .And(quality.bitwiseAnd(4).eq(0)).And(quality.
                                              bitwiseAnd(1024).eq(0)).And(quality.bitwiseAnd(128).eq(0)) \
        .And(quality.bitwiseAnd(2048).eq(0)).And(quality.bitwiseAnd(8192).eq(0))
    masked = img.updateMask(newMask)
    return masked.copyProperties(img, ['system:time_start', 'system:time_end'])


def calc_indices_viirs(image):
    nir = image.select('NIR_reflectance')
    red = image.select('red_reflectance')
    blue = image.select('blue_reflectance')
    swir = image.select('SWIR2_reflectance')
    msi = calc_msi(swir, nir)
    arvi = calc_arvi(nir, red, blue)
    savi = calc_savi(nir, red)
    vsdi = calc_vsdi_rescaled(image, 'SWIR2_reflectance', 'red_reflectance', 'blue_reflectance')
    return msi.addBands(arvi).addBands(vsdi).addBands(savi).copyProperties(image,
                                                                           ['system:time_start', 'system:time_end'])


def calc_indices_mod09(image):
    nir = image.select('sur_refl_b02')
    red = image.select('sur_refl_b01')
    blue = image.select('sur_refl_b03')
    swir = image.select('sur_refl_b07')

    msi = calc_msi(swir, nir)
    arvi = calc_arvi(nir, red, blue)
    savi = calc_savi(nir, red)
    # vsdi = calc_vsdi(image, 'sur_refl_b07', 'sur_refl_b01', 'sur_refl_b03')
    vsdi = calc_vsdi_rescaled(image, 'sur_refl_b07', 'sur_refl_b01', 'sur_refl_b03')

    return msi.addBands(arvi).addBands(vsdi).addBands(savi).copyProperties(image,
                                                                           ['system:time_start', 'system:time_end'])


def create_veg_indices(indx, startdate, enddate, repository_name, area_of_interest):
    # print(startdate)
    # print(repository_name)
    # print(area_of_interest)
    # enddate = str(date.today())
    # print(enddate)

    print("Processing for {} from {} to {} saving in {}".format(indx, startdate, enddate, repository_name))

    area_of_interest = ee.FeatureCollection(area_of_interest)
    aoi = area_of_interest.geometry()

    if indx == 'MODIS':
        modis09 = ee.ImageCollection("MODIS/006/MOD09A1")
        selected_modis_refl = modis09.filterDate(startdate, enddate).filterBounds(aoi).map(maskMOD09)
        processed = selected_modis_refl.map(calc_indices_mod09)
    elif indx == 'VIIRS':
        viirsdata = ee.ImageCollection("NOAA/VIIRS/001/VNP13A1")
        selected_viirs = viirsdata.filterDate(startdate, enddate).filterBounds(aoi).map(maskVIIRS)
        processed = selected_viirs.map(calc_indices_viirs)

    imageIds = processed.aggregate_array('system:index')
    value = imageIds.getInfo()

    for i in value:
        image = ee.Image(processed.filter(
            ee.Filter.eq('system:index', i)).first())  # .clip(aoi)
        saviimage = image.select('SAVI')

        task_ordered1 = ee.batch.Export.image.toAsset(
            image=saviimage,
            description='Export_' + i + '_SAVI',
            assetId=repository_name + "/VIIRS_SAVI_INT/SAVI_" + i,
            region=aoi.bounds().getInfo()['coordinates'][0],
            # in special case of error use .bounds().getInfo()['coordinates'][0] or else only bounds()
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        msiimage = image.select('MSI')
        task_ordered2 = ee.batch.Export.image.toAsset(
            image=msiimage,
            description='Export_' + i + '_MSI',
            assetId=repository_name + "/VIIRS_MSI_INT/MSI_" + i,
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        vsdiimage = image.select('VSDI')
        task_ordered3 = ee.batch.Export.image.toAsset(
            image=vsdiimage,
            description='Export_' + i + '_VSDI',
            assetId=repository_name + "/VIIRS_VSDI_INT/VSDI_" + i,
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        arviimage = image.select('ARVI')
        task_ordered4 = ee.batch.Export.image.toAsset(
            image=arviimage,
            description='Export_' + i + '_ARVI',
            assetId=repository_name + "/VIIRS_ARVI_INT/ARVI_" + i,
            region=aoi.bounds().getInfo()['coordinates'][0],
            scale=500,
            crs='EPSG:4326',
            maxPixels=10e12)

        task_ordered1.start()
        task_ordered2.start()
        task_ordered3.start()
        task_ordered4.start()
    print("order no:", i)
    return "Done"


def main(argument):
    # Options
    input_date_start = ''
    input_date_end = ''
    input_repository_name = ''
    input_area_of_interest = ''
    satellite = ''
    options = "hp:s:e:d:a:"

    # Long options
    long_options = ["Help", "prod = ", "SDate = ", "EDate = ", "EEAsset =", "aoi ="]

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
            Help for creating ARVI, SAVI, MSI and VSDI from 8 Day MODIS or VIIRS using Google Earth Engine (GEE).
            Outputs are saved in the designated GEE asset folder, wherein each index is saved in its sub-folder.
            
            python create_indices_viirs.py -p product -s startdate -e enddate -d Output/folder/path -a location/of/aoi/file
            where;
            -p, -Prod      Satellite product e.g. MODIS or VIIRS
            -s, -SDate     Date to start processing from e.g. 2011-01-01
            -e, -EDate     Date to end processing from e.g. 2012-01-31
            -d, -EEAsset   Location to save in GEE asset. it will automatically save in each of indices sub folder.       
                           e.g. projects/servir-mekong/EODrought
                           NOTE: you have to create subfolders in EEAsset manually if they dont exist.
                           naming convention used: VIIRS_ARVI_INT,VIIRS_SAVI_INT, VIIRS_MSI_INT, VIIRS_VSDI_INT
            -a, -aoi       aoi file location. Should be a feature collection. 
                           e.g. projects/servir-mekong/Lower_mekong_boundary
            ''')
            sys.exit()

        elif currentArgument in ("-p", "--Prod"):
            satellite = currentValue  # e.g. MODIS OR VIIRS
        elif currentArgument in ("-s", "--SDate"):
            input_date_start = currentValue  # e.g. '2011-01-01'
        elif currentArgument in ("-e", "--EDate"):
            input_date_end = currentValue  # e.g. '2011-01-01'
        elif currentArgument in ("-d", "--EEAsset"):
            input_repository_name = currentValue  # e.g. "projects/servir-mekong/EODrought"
        elif currentArgument in ("-a", "--aoi"):
            input_area_of_interest = currentValue  # e.g. "projects/servir-mekong/Lower_mekong_boundary"

    print('input_date_end', input_date_end)
    print('input_repository_name', input_repository_name)
    print('input_area_of_interest', input_area_of_interest)

    result = create_veg_indices(satellite, input_date_start, input_date_end, input_repository_name, input_area_of_interest)
    print(result)


if __name__ == '__main__':
    main(sys.argv[1:])
    # python create_indices.py -p MODIS -s 2015-03-04 -e 2018-03-04 -d "users/seiasia/internal_SERVIR/" -a "projects/servir-mekong/Lower_mekong_boundary"
    # localtest = create_indices("2015-03-04", "2018-03-04", "users/seiasia/internal_SERVIR/", "projects/servir-mekong/Lower_mekong_boundary")

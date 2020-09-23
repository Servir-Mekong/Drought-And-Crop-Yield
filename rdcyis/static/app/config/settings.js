var settings = {
    menus: [
        {
            'name': 'Methods',
            'url': '/method/',
            'show': true
        },
        {
            'name': 'Publications',
            'url': '/publications/',
            'show': true
        },
        {
            'name': 'Service Applications',
            'url': '/service-applications/',
            'show': true
        }
    ],
    application: {
        name: 'Mekong Drought and Crop Watch',
        url: '/home/'
    },
    footerLinks: [{
            'name': 'About',
            'url': 'https://servir.adpc.net/about/about-servir-mekong',
            'show': true
        },
        {
            'name': 'Tools',
            'url': 'https://servir.adpc.net/tools',
            'show': true
        },
        {
            'name': 'Geospatial Datasets',
            'url': 'https://servir.adpc.net/geospatial-datasets',
            'show': true
        },
        {
            'name': 'Resources and Publications',
            'url': 'https://servir.adpc.net/publications',
            'show': true
        },
        {
            'name': 'News',
            'url': 'https://servir.adpc.net/news',
            'show': true
        },
        {
            'name': 'Events',
            'url': 'https://servir.adpc.net/events',
            'show': true
        },
        {
            'name': 'Contact Us',
            'url': 'https://servir.adpc.net/about/contact-servir-mekong',
            'show': true
        },
        {
            'name': 'Privacy Policy',
            'url': '#',
            'show': true
        }
    ],
    partnersHeader: [{
            'alt': 'The United States Agency for International Development',
            'url': 'https://www.usaid.gov/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/USAID_Logo_Color.png',
            'src': 'images/usaid.png',
            'className': 'usaid',
            'version1': true
        },
        {
            'alt': 'The National Aeronautics and Space Administration',
            'url': 'https://www.nasa.gov/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/NASA_Logo_Color.png',
            'src': 'images/nasa.png',
            'className': 'nasa',
            'version1': true
        },
        {
            'alt': 'Asian Disaster Preparedness Center',
            'url': 'http://www.adpc.net/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-adbc.png',
            'src': 'images/adpc.png',
            'className': 'adpc',
            'version1': true
        },
        {
            'alt': 'SERVIR-Mekong',
            'url': 'https://servir.adpc.net/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/Servir_Logo_Color.png',
            'src': 'images/servir-mekong.png',
            'className': 'servir',
            'version1': true
        },
    ],
    partnersFooter: [{
            'alt': 'Spatial Infomatics Group',
            'url': 'https://sig-gis.com/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sig.png',
            'src': 'images/sig.png',
            'className': 'partner-sig'
        },
        {
            'alt': 'Stockholm Environment Institute',
            'url': 'https://www.sei-international.org/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-sei.png',
            'src': 'images/sei.png',
            'className': 'partner-sei'
        },
        {
            'alt': 'Deltares',
            'url': 'https://www.deltares.nl/en/',
            //'src': 'https://servir.adpc.net/themes/svmk/images/optimized/partner-deltares.png',
            'src': 'images/deltares.png',
            'className': 'partner-deltares'
        }
    ],
    areaIndexSelectors: [{
            'value': 'mekong',
            'name': 'Mekong Region'
        },
        {
            'value': 'lmr',
            'name': 'LMR Basin'
        },
        {
            'value': 'country',
            'name': 'Country Level'
        },
        {
            'value': 'province',
            'name': 'Administrative Level'
        }
    ],

    countries: ['Cambodia', 'Laos', 'Myanmar', 'Thailand', 'Vietnam'],
    // this list is generated from python script at /scripts/list-provience.py

    variables: [
        {
            'name': 'SB: Visible and Shortwave Infrared Drought Index (VSDI)',
            'value': 'sb-vsdi'
        },
        {
            'name': 'SB: Moisture Stress Index (MSI)',
            'value': 'sb-msi'
        },
        {
            'name': 'SB: Atmospherically Resistant Vegetation Index (ARVI)',
            'value': 'sb-arvi'
        },
        {
            'name': 'SB: Soil-adjusted Vegetation Index (SAVI)',
            'value': 'sb-savi'
        },
        {
            'name': 'SB: Enhanced Vegetation Index (EVI)',
            'value': 'sb-evi'
        },
        {
            'name': 'SB: Keetch–Byram Drought Index (KBDI)',
            'value': 'sb-kbdi'
        },
        {
            'name': 'SB: Normalized Difference Vegetation Index (NDVI)',
            'value': 'sb-ndvi'
        },
        {
          'name': 'MB: Keetch-Byram Drought Index (KBDI)',
          'value': 'mb-kbdi'
        },
        {
          'name': 'MB: Combined Drought Index (CDI)',
          'value': 'mb-cdi'
        },
        {
          'name': 'MB: Drought Severity (%)',
          'value': 'mb-severity'
        },
        {
          'name': 'MB: Dry Spell Events (during last 2 weeks)',
          'value': 'mb-dryspells'
        },
        {
          'name': 'MB: SMDI: Soil Moisture Deficit Index (SMDI)',
          'value': 'mb-smdi'
        },
        {
          'name': 'MB: SPI 1 month: Standardized Precipitation Index (1 month)',
          'value': 'mb-spi1'
        },
        {
          'name': 'MB: SPI 3 month: Standardized Precipitation Index (3 month)',
          'value': 'mb-spi3'
        },
        {
          'name': 'MB: SRI 1 month: Standardized Runoff Index (1 month)',
          'value': 'mb-sri1'
        },
        {
          'name': 'MB: SRI 3 month: Standardized Runoff Index (3 month)',
          'value': 'mb-sri3'
        },
        {
          'name': 'MB: Root Zone Soil Moisture (mm)',
          'value': 'mb-rootmoist'
        },
        {
          'name': 'MB: Soil Moisture (mm)',
          'value': 'mb-soil_moist'
        },
        {
          'name': 'MB: Soil Temperature (C)',
          'value': 'mb-soil_temp'
        },
        {
          'name': 'MB: Rainfall (mm)',
          'value': 'mb-rainf'
        },
        {
          'name': 'MB: Average Surface Temperature (C)',
          'value': 'mb-surf_temp'
        },
        {
          'name': 'MB: Relative Humidity (%)',
          'value': 'mb-rel_humid'
        },
        {
          'name': 'MB: Evaporation (mm)',
          'value': 'mb-evap'
        },
        {
          'name': 'MB: PET (mm)',
          'value': 'mb-pet_natveg'
        },
        {
          'name': 'MB: Baseflow (mm/day)',
          'value': 'mb-baseflow'
        },
        {
          'name': 'MB: Surface Runoff (mm)',
          'value': 'mb-runoff'
        }
    ],
    periodicity: [
      {
        'name': '1 Month',
        'value': '1month'
      },
      {
        'name': '3 Months',
        'value': '3month'
      },
      {
        'name': '1 Year',
        'value': '1year'
      }
  ],
    months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    downloadServerURL: 'ftp://ftpuser:gvamuru@203.146.112.247',

    legendsSB: [
      {
        'class': 'No Drought',
        'color': 'FFF',
      },
      {
        'class': 'Moderate Drought',
        'color': 'FF7F27',
      },
      {
        'class': 'Severe Drought',
        'color': 'B97A57',
      },
      {
        'class': 'Extream Drought',
        'color': '880015',
      },
      {
        'class': 'No Data',
        'color': 'C3C3C3',
      }
    ],

    droughtLegend: [
            {
                'name': 'current',
                'colors': ['#0000ff' ,'#00ff00', '#007f30', '#30b855', '#ff0001','#ffff00'],
                'label':['No Data (-9999 or nodata)', 'EXD (0.0 - 0.2)', 'SED (0.2 - 0.4)', 'MOD (0.4 - 0.8)', 'No Drought (> 0.8)'],
            },
            {
                'name': 'sb-vsdi',
                'colors': ['#C3C3C3' ,'#880015', '#B97A57', '#F89F1D','#FFFFFF'],
                'label':['No Data (-9999 or nodata)', 'EXD (0.0 - 0.2)', 'SED (0.2 - 0.4)', 'MOD (0.4 - 0.8)', 'No Drought (> 0.8)'],
            },
            {
                'name': 'sb-arvi',
                'colors': ['#E85B3A','#F99E59','#FEC981','#FFEDAB','#F7FCDF','#C4E687','#97D265','#58B453','#1A9641'],
                'label':['High Stress (-1)','','','','','','','',' Low Stress (+1)'],
            },
            {
                'name': 'sb-savi',
                'colors': ['#E85B3A','#F99E59','#FEC981','#FFEDAB','#F7FCDF','#C4E687','#97D265','#58B453','#1A9641'],
                'label':['High Stress (-1)','','','','','','','',' Low Stress (+1)'],
            },
            {
                'name': 'sb-evi',
                'colors': ['#E85B3A','#F99E59','#FEC981','#FFEDAB','#F7FCDF','#C4E687','#97D265','#58B453','#1A9641'],
                'label':['High Stress (-1)','','','','','','','',' Low Stress (+1)'],
            },
            {
                'name': 'sb-ndvi',
                'colors': ['#E85B3A','#F99E59','#FEC981','#FFEDAB','#F7FCDF','#C4E687','#97D265','#58B453','#1A9641'],
                'label':['High Stress (-1)','','','','','','','',' Low Stress (+1)'],
            },
            {
                'name': 'sb-ndvi_ano',
                'colors': ['#E85B3A','#F99E59','#FEC981','#FFEDAB','#F7FCDF','#C4E687','#97D265','#58B453','#1A9641'],
                'label':['High Stress (-2)','','','','','','','',' Low Stress (+2)'],
            },
            {
                'name': 'mb-kdbi',
                'colors': ['#C3C3C3','#FFFFFF','#F89F1D','#B97A57','#880015'],
                'label':['#C3C3C3','#FFFFFF','#F89F1D','#B97A57','#880015'],
            },
            {
                'name': 'sb-kdbi',
                'colors': ['#C3C3C3','#FFFFFF','#F89F1D','#B97A57','#880015'],
                'label':['No Data (-9999 or nodata)','No Drought (< 399)','MOD (400 - 499)','SED (500 - 649)','EXD (650 - 800)'],
            },
            {
                'name': 'mb-cdi',
                'colors': ['#FFFFFF','#F89F1D','#B97A57','#880015'],
                'label':['Normal','Watch','Warning','Alert'],
            },
            {
                'name': 'mb-spi1',
                'colors': ['#880015','#B97A57','#F89F1D','#FFFFFF'],
                'label':['EXD (< -2.0)','SED (-1.5 - -1.99)','MOD (-1.0 - -1.49)','Normal or Wet (> -0.99)'],
            },
            {
                'name': 'mb-spi3',
                'colors': ['#880015','#B97A57','#F89F1D','#FFFFFF'],
                'label':['EXD (< -2.0)','SED (-1.5 - -1.99)','MOD (-1.0 - -1.49)','Normal or Wet (> -0.99)'],
            },
            {
                'name': 'mb-sri1',
                'colors': ['#880015','#B97A57','#F89F1D','#FFFFFF'],
                'label':['EXD (< -2.0)','SED (-1.5 - -1.99)','MOD (-1.0 - -1.49)','Normal or Wet (> -0.99)'],
            },
            {
                'name': 'mb-sri3',
                'colors': ['#880015','#B97A57','#F89F1D','#FFFFFF'],
                'label':['EXD (< -2.0)','SED (-1.5 - -1.99)','MOD (-1.0 - -1.49)','Normal or Wet (> -0.99)'],
            },
            {
                'name': 'mb-soil_moist',
                'colors': ['#880015','#B97A57','#F89F1D','#FFFFFF'],
                'label':['EXD (0 - 5)','SED (6 - 10)','MOD (11 - 20)','Normal or Wet (> 21)'],
            },
            {
                'name': 'sb-msi',
                'colors': ['#1A9641', '#58B453', '#97D265', '#C4E687', '#F7FCDF', '#FFEDAB', '#FEC981', '#F99E59', '#E85B3A'],
                'label':['#1A9641', '#58B453', '#97D265', '#C4E687', '#F7FCDF', '#FFEDAB', '#FEC981', '#F99E59', '#E85B3A'],
            },
            {
                'name': 'mb-severity',
                'colors': ["#FFFFB2","#FEE78A","#FED165","#FDB751","#FD9B43","#FA7A35","#F45629","#EA331F","#D31A23","#BC0022"],
                'label':['0 - 10','10 - 20','20 - 30','30 - 40','40 - 50','50 - 60','60 - 70' ,'70 - 80' ,'80 - 90' ,'90 - 100'],
            },
            {
                'name': 'mb-dryspells',
                'colors': ['#FFFFD4','#FEE5A5','#FEC36C','#FE9929','#E46F12','#C3500A','#993404'],
                'label':['0 - 2','2 - 4','4 - 6','6 - 8','8 - 10','10 - 12','12 - 14'],
            },
            {
                'name': 'mb-surf_temp',
                'colors': ['#0370AF','#348DBF','#75B4D4','#A5CEE2','#CDE2EC','#F6F6F6','#F4D5C7','#F4B599','#EB846E','#DA4247','#CA0020'],
                'label':['0 - 10','10 - 13','13 - 16','16 - 19','19 - 22','22 - 25','25 - 28','28 - 31','31 - 34','34 - 36','36 +'],
            },
            {
                'name': 'mb-rootmoist',
                'colors': ['#C9001E' ,'#DA3F41' ,'#EF9277' ,'#F4B4A2' ,'#F6E4DD' ,'#E0EBF1' ,'#B3D5E6' ,'#82BBD8' ,'#4396C4' ,'#0571B0' ],
                'label':['< 100','100 - 200','200 - 300','300 - 400','400 - 500','500 - 600','600 - 700','700 - 800','800 - 900' ,'900 - 1000'],
            },
            {
                'name': 'mb-soil_temp',
                'colors': ['#2C7BB6','#569AC7','#A0CBE2','#ABD9E9','#E5F3EF','#E2F2CC','#FFFFBF','#FEE49F','#FDC77B','#FDAA5B','#F07C4A','#E34A33','#D7191C'],
                'label':['Less than 8','8 - 10','10 - 12','12 - 14','14 - 16','16 - 18','18 - 20','20 - 22','22 - 24','24 - 26','26 - 28','28 - 30','30 +'],
            },
            {
                'name': 'mb-baseflow',
                'colors': ['#FFFFCC','#DFF2C4','#C0E6BC','#A1DAB4','#81CEB9','#61C2BE','#41B6C4','#3AA3C0','#3391BC','#2C7FB8','#2965AC','#274DA0','#253494'],
                'label':['< 0','0 - 0.2','0.2 - 0.4','0.4 - 0.6','0.6 - 0.8','0.8 - 1.0','1.0 - 1.4','1.4 - 1.8','1.8 - 2.0','2.0 - 3.0','3.0 - 4.0','4.0 - 5.0','30 +'],
            },
            {
                'name': 'mb-pet_netveg',
                'colors': ['#F0F9E8','#D8F0D5','#C0E7C1','#A5DCBF','#89D2C2','#6EC3C6','#56B0C8','#3C9CC7','#2282BA','#0868AC'],
                'label':['< 1' ,'1 - 2' ,'2 - 3' ,'3 - 4' ,'4 - 5' ,'5 - 6' ,'6 - 7' ,'7 - 8' ,'8 - 9' ,'9 +']
            },
            {
                'name': 'mb-rainf',
                'colors': ['#FFFFFF','#E5B42C','#E3B022','#F2B464','#F2B464','#F3E976','#91CE7E','#89CE74','#43BE87','#34B485','#30B282','#069B42','#069B42'],
                'label':['0 - 1','1 - 2','2 - 3','3 - 4','4 - 5','5 - 10','10 - 20','20 - 30','30 - 40','40 - 50','50 - 60','60 - 70','70 +']
            },
            {
                'name': 'mb-runoff',
                'colors': ['#A6621C' ,'#BA843E' ,'#CFA762' ,'#E1C687' ,'#E9D9B3' ,'#F1EBDF' ,'#DFEDEB' ,'#B5DFD8' ,'#8AD0C5' ,'#5DB9AB' ,'#5DB9AB' ,'#018571' ],
                'label':['Less than 0.0','0.0 - 0.1','0.1 - 0.2','0.2 - 0.3','0.3 - 0.4','0.4 - 0.5','0.5 - 0.6','0.6 - 0.7','0.7 - 0.8','0.8 - 0.9','0.9 - 1.0','10 +']
            },
            {
                'name': 'mb-evap',
                'colors': ['#51125F','#482172','#423E84','#38588B','#2C6F8E','#24848E','#1E9B89','#2AB07E','#50C469','#85D44A','#C1DF23','#FDE725'],
                'label':['< 0.0','0.0 - 0.3','0.3 - 0.6','0.6 - 0.9','0.9 - 1.2','1.2 - 1.6','1.6 - 2.0','2.0 - 2.5','2.5 - 3.0','3.0 - 3.5','3.5 - 4.0','4.0 +']
            },
            {
                'name': 'mb-rel_humid',
                'colors': ['#7C3595','#9B65AE','#BA98C9','#D4C1DD','#ECE5EF','#E5F1E4','#C1E5BD','#95D295','#4AAD66','#008837'],
                'label':['< 10' ,'10 - 20' ,'20 - 30' ,'30 - 40' ,'40 - 50' ,'50 - 60' ,'60 - 70' ,'70 - 80' ,'80 - 90'  ,'90 +']
            }


        ]
};

angular.module('landcoverportal')
.constant('appSettings', settings);

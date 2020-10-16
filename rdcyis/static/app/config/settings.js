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
    areaIndexSelectors: [
        {
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
        },
        {
            'value': 'clear',
            'name': 'Clear Area'
        }
    ],

    countries: ['Cambodia', 'Laos', 'Myanmar', 'Thailand', 'Vietnam'],
    // this list is generated from python script at /scripts/list-provience.py


    variables: [
        {
            'name': 'SB: VSDI: Visible and Shortwave infrared Drought Index',
            'value': 'sb-vsdi'
        },
        {
            'name': 'SB: MSI: Moisture Stress Index',
            'value': 'sb-msi'
        },
        {
            'name': 'SB: ARVI: Atmospherically Resistant Vegetation Index',
            'value': 'sb-arvi'
        },
        {
            'name': 'SB: SAVI: Soil Adjusted Vegetation Index',
            'value': 'sb-savi'
        },
        {
            'name': 'SB: EVI: Enhanced Vegetation Index',
            'value': 'sb-evi'
        },
        // {
        //     'name': 'SB: Keetch–Byram Drought Index (KBDI)',
        //     'value': 'sb-kbdi'
        // },
        {
            'name': 'SB: NDVI: Normalized Difference Vegetation Index',
            'value': 'sb-ndvi'
        },
        {
          'name': 'MB: KBDI: Keetch-Byram Drought Index',
          'value': 'mb-kbdi'
        },
        {
          'name': 'MB: CDI: Combined Drought Index',
          'value': 'mb-cdi'
        },
        {
          'name': 'MB: Drought Severity (%)',
          'value': 'mb-severity'
        },
        {
          'name': 'MB: Dry Spell Events',
          'value': 'mb-dryspells'
        },
        {
          'name': 'MB: SMDI: Soil Moisture Deficit Index',
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
                'colors': ['' ,'#00ff00', '#007f30', '#30b855', '#ff0001','#ffff00'],
                'label':['No Data', 'EXD', 'SED', 'MOD', 'No Drought'],
            },
            {
                'name': 'sb-vsdi',
                'colors': ['#F89F1D', '#B97A57', '#880015','#88A541',''],
                'label':['MOD', 'SED', 'EXD', 'No Drought','No Data'],
            },
            {
                'name': 'sb-arvi',
                'colors': ['#E85B3A', '#F99E59', '#FEC981', '#FFEDAB', '#F7FCDF', '#C4E687', '#97D265', '#58B453','#1A9641', '#FFFFFF'],
                'label':['High Stress', '', '', '', '', '', '', '', 'Low Stress', 'No Data'],
            },
            {
                'name': 'sb-savi',
                'colors': ['#E85B3A', '#F99E59', '#FEC981', '#FFEDAB', '#F7FCDF', '#C4E687', '#97D265', '#58B453','#1A9641', '#FFFFFF'],
                'label':['High Stress', '', '', '', '', '', '', '', 'Low Stress', 'No Data'],
            },
            {
                'name': 'sb-evi',
                'colors': ['#E85B3A','#F99E59','#FEC981','#FFEDAB','#F7FCDF','#C4E687','#97D265','#58B453','#1A9641'],
                'label':['High Stress','','','','','','','',' Low Stress'],
            },
            {
                'name': 'sb-ndvi',
                'colors': ['#E85B3A', '#F99E59', '#FEC981', '#FFEDAB', '#F7FCDF', '#C4E687', '#97D265', '#58B453','#1A9641', '#FFFFFF'],
                'label':['High Stress', '', '', '', '', '', '', '', 'Low Stress', 'No Data'],
            },
            {
                'name': 'sb-ndvi_ano',
                'colors': ['#E85B3A', '#F99E59', '#FEC981', '#FFEDAB', '#F7FCDF', '#C4E687', '#97D265', '#58B453','#1A9641', '#FFFFFF'],
                'label':['High Stress', '', '', '', '', '', '', '', 'Low Stress', 'No Data'],
            },
            {
                'name': 'sb-kbdi',
                'colors': ['#F89F1D', '#B97A57', '#880015','#88A541',''],
                'label':['MOD', 'SED', 'EXD', 'No Drought','No Data'],
            },
            {
                'name': 'mb-kbdi',
                'colors': ['#F89F1D','#B97A57','#880015', '#88A541', ''],
                'label':['MOD','SED','EXD', 'No Drought', 'No Data'],
            },
            {
                'name': 'mb-cdi',
                'colors': ['#88A541','#F89F1D','#B97A57','#880015'],
                'label':['None','Watch','Warning','Alert'],
            },
            {
                'name': 'mb-spi1',
                'colors': ['#F89F1D','#B97A57','#880015','#FFFFFF'],
                'label':['MOD','SED','EXD','Normal or Wet'],
            },
            {
                'name': 'mb-spi3',
                'colors': ['#F89F1D','#B97A57','#880015','#FFFFFF'],
                'label':['MOD','SED','EXD','Normal or Wet'],
            },
            {
                'name': 'mb-sri1',
                'colors': ['#F89F1D','#B97A57','#880015','#FFFFFF'],
                'label':['MOD','SED','EXD','Normal or Wet'],
            },
            {
                'name': 'mb-sri3',
                'colors': ['#F89F1D','#B97A57','#880015','#FFFFFF'],
                'label':['MOD','SED','EXD','Normal or Wet'],
            },
            {
                'name': 'mb-smdi',
                'colors': ['#F89F1D','#B97A57','#880015','#FFFFFF'],
                'label':['MOD','SED','EXD','Normal or Wet'],
            },
            {
                'name': 'mb-soil_moist',
                'colors': ['#F89F1D','#B97A57','#880015','#FFFFFF'],
                'label':['MOD','SED','EXD','Normal or Wet'],
            },
            {
                'name': 'sb-msi',
                'colors': ['#E85B3A', '#F99E59', '#FEC981', '#FFEDAB', '#F7FCDF', '#C4E687', '#97D265', '#58B453','#1A9641', '#FFFFFF'],
                'label':['High Stress', '', '', '', '', '', '', '', 'Low Stress', 'No Data'],
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
                'label':['0 - 15','15 - 20','20 - 21','21 - 22','22 - 23','23 - 24','25 - 26','27 - 28','28 - 29','29 - 30','30 +'],
            },
            {
                'name': 'mb-rootmoist',
                'colors': ['#C9001E' ,'#DA3F41' ,'#EF9277' ,'#F4B4A2' ,'#F6E4DD' ,'#E0EBF1' ,'#B3D5E6' ,'#82BBD8' ,'#4396C4' ,'#0571B0' ],
                'label':['< 100','100 - 200','200 - 300','300 - 400','400 - 500','500 - 600','600 - 700','700 - 800','800 - 900' ,'900 - 1000'],
            },
            {
                'name': 'mb-soil_temp',
                'colors': ['#2C7BB6','#569AC7','#A0CBE2','#ABD9E9','#E5F3EF','#E2F2CC','#FFFFBF','#FEE49F','#FDC77B','#FDAA5B','#F07C4A','#E34A33','#D7191C'],
                'label':['0 - 5','5 - 10','10 - 15','15 - 20','20 - 21','21 - 22','22 - 23','24 - 25','25 - 26','26 - 27','27 - 28','28 - 29','30 +'],
            },
            {
                'name': 'mb-baseflow',
                'colors': ['#FFFFCC','#DFF2C4','#C0E6BC','#A1DAB4','#81CEB9','#61C2BE','#41B6C4','#3AA3C0','#3391BC','#2C7FB8','#2965AC','#274DA0','#253494'],
                'label':['0 - 2','2 - 4','4 - 6','6 - 8','8 - 10','10 - 12','12 - 14','14 - 16','16 - 18','18 - 20','20 - 22','22 - 24','24 +'],
            },
            {
                'name': 'mb-pet_natveg',
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
                'label':['0 - 5','5 - 10','10 - 20','20 - 30','30 - 40','40 - 50','50 - 60','60 - 70','70 - 80','80 - 90','90 - 100','100 +']
            },
            {
                'name': 'mb-evap',
                'colors': ['#51125F','#482172','#423E84','#38588B','#2C6F8E','#24848E','#1E9B89','#2AB07E','#50C469','#85D44A','#C1DF23','#FDE725'],
                'label':['0 - 2','2 - 4','4 - 6','6 - 8','8 - 10','10 - 12','12 - 14','14 - 16','16 - 18','18 - 20','20 - 22','22 +']
            },
            {
                'name': 'mb-rel_humid',
                'colors': ['#7C3595','#9B65AE','#BA98C9','#D4C1DD','#ECE5EF','#E5F1E4','#C1E5BD','#95D295','#4AAD66','#008837'],
                'label':['< 10' ,'10 - 20' ,'20 - 30' ,'30 - 40' ,'40 - 50' ,'50 - 60' ,'60 - 70' ,'70 - 80' ,'80 - 90'  ,'90 +']
            }

        ]
};

angular.module('mekongDroughtandCropWatch')
.constant('appSettings', settings);

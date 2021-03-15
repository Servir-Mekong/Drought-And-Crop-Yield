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

        ],

        climateAbsoluteVariables: [
          {
            'name': 'Amount of Cold Nights (%)',
            'value': 'tn10p-absolute'
          },
          {
            'name': 'Amount of Hot Days (%)',
            'value': 'tx90p-absolute'
          },
          {
            'name': 'Consecutive Dry Days (days)',
            'value': 'cdd-absolute'
          },
          {
            'name': 'Consecutive Wet Days (days)',
            'value': 'cwd-absolute'
          },
          {
            'name': 'Daily Mean Temperature (C)',
            'value': 'tmm-absolute'
          },
          {
            'name': 'Daily minimum Temperature (C)',
            'value': 'tnn-absolute'
          },
          {
            'name': 'Daily maximum Temperature (C)',
            'value': 'txx-absolute'
          },
          {
            'name': 'Drought Susceptibility (based on SPEI) (%) ',
            'value': 'spei-absolute'
          },
          {
            'name': 'Drought Susceptibility (based on SPI) (%)',
            'value': 'spi-absolute'
          },
          {
            'name': 'Growing Degree Days (degree-days)',
            'value': 'gddgrow10-absolute'
          },
          {
            'name': 'Growing Season Length (days)',
            'value': 'gsl-absolute'
          },
          {
            'name': 'Number of Very Heavy Rain Days (days)',
            'value': 'r20mm-absolute'
          }

        ],

        climateChangeVariables: [
          {
            'name': 'Amount of Cold Nights (%) ',
            'value': 'tn10p-change'
          },
          {
            'name': 'Amount of Hot Days (%)',
            'value': 'tx90p-change'
          },
          {
            'name': 'Consecutive Dry Days (days)',
            'value': 'cdd-change'
          },
          {
            'name': 'Consecutive Wet Days (days)',
            'value': 'cwd-change'
          },
          {
            'name': 'Daily Mean Temperature (C)',
            'value': 'tmm-change'
          },
          {
            'name': 'Daily minimum Temperature (C)',
            'value': 'tnn-change'
          },
          {
            'name': 'Daily maximum Temperature (C)',
            'value': 'txx-change'
          },
          {
            'name': 'Drought Susceptibility (based on SPEI) (%) ',
            'value': 'spei-change'
          },
          {
            'name': 'Drought Susceptibility (based on SPI) (%)',
            'value': 'spi-change'
          },
          {
            'name': 'Growing Degree Days (degree-days)',
            'value': 'gddgrow10-change'
          },
          {
            'name': 'Growing Season Length (days)',
            'value': 'gsl-change'
          },
          {
            'name': 'Number of Very Heavy Rain Days (days)',
            'value': 'r20mm-change'
          },

        ],


        climateAbsoluteScenarios: [
          {
            'name': '-',
            'value': 'his'
          },
          {
            'name': 'RCP 4.5',
            'value': 'rcp45'
          },
          {
            'name': 'RCP 8.5',
            'value': 'rcp85'
          },
        ],

        climatePeriod: [
          {
            'name': 'Historical',
            'value': 'his'
          },
          {
            'name': 'Near Future: 2030s',
            'value': '2016-2045'
          },
          {
            'name': 'Middle Future: 2050s',
            'value': '2036-2065'
          },
          {
            'name': 'Far Future: 2080s',
            'value': '2066-2095'
          },
        ],

        climateRCPPeriod: [
          {
            'name': 'Near Future: 2030s',
            'value': '2016-2045'
          },
          {
            'name': 'Middle Future: 2050s',
            'value': '2036-2065'
          },
          {
            'name': 'Far Future: 2080s',
            'value': '2066-2095'
          },
        ],
        climateHistoricalPeriod: [
          {
            'name': 'Historical',
            'value': 'his'
          },
        ],

        climateChangeScenarios: [
          {
            'name': 'RCP 4.5',
            'value': 'rcp45'
          },
          {
            'name': 'RCP 8.5',
            'value': 'rcp85'
          },
        ],


        climateStoreName:
          {
            'cdd-absolute': {
              'style': 'rdcyis-climate-absolute-cdd',
              'his': {
                'his': 'cdd_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'cdd_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'cdd_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'cdd_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'cdd_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'cdd_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'cdd_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'cwd-absolute': {
              'style': 'rdcyis-climate-absolute-cwd',
              'his': {
                'his': 'cwd_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'cwd_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'cwd_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'cwd_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'cwd_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'cwd_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'cwd_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tmm-absolute': {
              'style': 'rdcyis-climate-absolute-tmm',
              'his': {
                'his': 'tmm_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'tmm_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'tmm_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'tmm_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'tmm_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'tmm_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'tmm_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tnn-absolute': {
              'style': 'rdcyis-climate-absolute-tnn',
              'his': {
                'his': 'tnn_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'tnn_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'tnn_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'tnn_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'tnn_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'tnn_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'tnn_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'txx-absolute': {
              'style': 'rdcyis-climate-absolute-txx',
              'his': {
                'his': 'txx_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'txx_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'txx_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'txx_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'txx_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'txx_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'txx_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'r20mm-absolute': {
              'style': 'rdcyis-climate-absolute-r20mm',
              'his': {
                'his': 'r20mm_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'r20mm_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'r20mm_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'r20mm_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'r20mm_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'r20mm_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'r20mm_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'spei-absolute': {
              'style': 'rdcyis-climate-absolute-spei',
              'his': {
                'his': 'prob_div_num_drought_drysea_spei6_MON_MK_1976-2005_his_ensm'
              },
              'rcp45': {
                '2016-2045' : 'prob_div_num_drought_drysea_spei6_MON_MK_2016-2045_rcp45_ensm',
                '2036-2065': 'prob_div_num_drought_drysea_spei6_MON_MK_2036-2065_rcp45_ensm',
                '2066-2095': 'prob_div_num_drought_drysea_spei6_MON_MK_2066-2095_rcp45_ensm'
              },
              'rcp85': {
                '2016-2045' : 'prob_div_num_drought_drysea_spei6_MON_MK_2016-2045_rcp85_ensm',
                '2036-2065': 'prob_div_num_drought_drysea_spei6_MON_MK_2036-2065_rcp85_ensm',
                '2066-2095': 'prob_div_num_drought_drysea_spei6_MON_MK_2066-2095_rcp85_ensm'
              }
            },

            'spi-absolute': {
              'style': 'rdcyis-climate-absolute-spi',
              'his': {
                'his': 'prob_div_num_drought_drysea_spi6_MON_MK_1976-2005_his_ensm'
              },
              'rcp45': {
                '2016-2045' : 'prob_div_num_drought_drysea_spi6_MON_MK_2016-2045_rcp45_ensm',
                '2036-2065': 'prob_div_num_drought_drysea_spi6_MON_MK_2036-2065_rcp45_ensm',
                '2066-2095': 'prob_div_num_drought_drysea_spi6_MON_MK_2066-2095_rcp45_ensm'
              },
              'rcp85': {
                '2016-2045' : 'prob_div_num_drought_drysea_spi6_MON_MK_2016-2045_rcp85_ensm',
                '2036-2065': 'prob_div_num_drought_drysea_spi6_MON_MK_2036-2065_rcp85_ensm',
                '2066-2095': 'prob_div_num_drought_drysea_spi6_MON_MK_2066-2095_rcp85_ensm'
              }
            },


            'gddgrow10-absolute': {
              'style': 'rdcyis-climate-absolute-gddgrow10',
              'his': {
                'his': 'gddgrow10_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'gddgrow10_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'gddgrow10_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'gddgrow10_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'gddgrow10_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'gddgrow10_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'gddgrow10_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'gsl-absolute': {
              'style': 'rdcyis-climate-absolute-gsl',
              'his': {
                'his': 'gsl_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'gsl_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'gsl_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'gsl_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'gsl_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'gsl_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'gsl_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tn10p-absolute': {
              'style': 'rdcyis-climate-absolute-tn10p',
              'his': {
                'his': 'tn10p_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'tn10p_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'tn10p_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'tn10p_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'tn10p_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'tn10p_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'tn10p_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tx90p-absolute': {
              'style': 'rdcyis-climate-absolute-tx90p',
              'his': {
                'his': 'tx90p_ANN_MK_1976-2005_his_ensm_mean'
              },
              'rcp45': {
                '2016-2045' : 'tx90p_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'tx90p_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'tx90p_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'tx90p_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'tx90p_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'tx90p_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'cdd-change': {
              'style': 'rdcyis-climate-change-cdd',
              'rcp45': {
                '2016-2045' : 'chg_cdd_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_cdd_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_cdd_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_cdd_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_cdd_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_cdd_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'cwd-change': {
              'style': 'rdcyis-climate-change-cwd',
              'rcp45': {
                '2016-2045' : 'chg_cwd_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_cwd_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_cwd_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_cwd_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_cwd_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_cwd_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tmm-change': {
              'style': 'rdcyis-climate-change-tmm',
              'rcp45': {
                '2016-2045' : 'chg_tmm_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_tmm_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_tmm_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_tmm_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_tmm_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_tmm_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tnn-change': {
              'style': 'rdcyis-climate-change-tnn',
              'rcp45': {
                '2016-2045' : 'chg_tnn_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_tnn_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_tnn_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_tnn_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_tnn_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_tnn_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'txx-change': {
              'style': 'rdcyis-climate-change-txx',
              'rcp45': {
                '2016-2045' : 'chg_txx_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_txx_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_txx_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_txx_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_txx_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_txx_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'r20mm-change': {
              'style': 'rdcyis-climate-change-r20mm',
              'rcp45': {
                '2016-2045' : 'chg_r20mm_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_r20mm_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_r20mm_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_r20mm_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_r20mm_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_r20mm_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'spei-change': {
              'style': 'rdcyis-climate-change-spei',
              'rcp45': {
                '2016-2045' : 'chg_prob_div_num_drought_drysea_spei6_MON_MK_2016-2045_rcp45_ensm',
                '2036-2065': 'chg_prob_div_num_drought_drysea_spei6_MON_MK_2036-2065_rcp45_ensm',
                '2066-2095': 'chg_prob_div_num_drought_drysea_spei6_MON_MK_2066-2095_rcp45_ensm'
              },
              'rcp85': {
                '2016-2045' : 'chg_prob_div_num_drought_drysea_spei6_MON_MK_2016-2045_rcp85_ensm',
                '2036-2065': 'chg_prob_div_num_drought_drysea_spei6_MON_MK_2036-2065_rcp85_ensm',
                '2066-2095': 'chg_prob_div_num_drought_drysea_spei6_MON_MK_2066-2095_rcp85_ensm'
              }
            },

            'spi-change': {
              'style': 'rdcyis-climate-change-spi',
              'rcp45': {
                '2016-2045' : 'chg_prob_div_num_drought_drysea_spi6_MON_MK_2016-2045_rcp45_ensm',
                '2036-2065': 'chg_prob_div_num_drought_drysea_spi6_MON_MK_2036-2065_rcp45_ensm',
                '2066-2095': 'chg_prob_div_num_drought_drysea_spi6_MON_MK_2066-2095_rcp45_ensm'
              },
              'rcp85': {
                '2016-2045' : 'chg_prob_div_num_drought_drysea_spi6_MON_MK_2016-2045_rcp85_ensm',
                '2036-2065': 'chg_prob_div_num_drought_drysea_spi6_MON_MK_2036-2065_rcp85_ensm',
                '2066-2095': 'chg_prob_div_num_drought_drysea_spi6_MON_MK_2066-2095_rcp85_ensm'
              }
            },


            'gddgrow10-change': {
              'style': 'rdcyis-climate-change-gddgrow10',
              'rcp45': {
                '2016-2045' : 'chg_gddgrow10_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_gddgrow10_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_gddgrow10_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_gddgrow10_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_gddgrow10_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_gddgrow10_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'gsl-change': {
              'style': 'rdcyis-climate-change-gsl',
              'rcp45': {
                '2016-2045' : 'chg_gsl_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_gsl_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_gsl_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_gsl_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_gsl_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_gsl_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tn10p-change': {
              'style': 'rdcyis-climate-change-tn10p',
              'rcp45': {
                '2016-2045' : 'chg_tn10p_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_tn10p_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_tn10p_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_tn10p_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_tn10p_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_tn10p_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

            'tx90p-change': {
              'style': 'rdcyis-climate-change-tx90p',
              'rcp45': {
                '2016-2045' : 'chg_tx90p_ANN_MK_2016-2045_rcp45_ensm_mean',
                '2036-2065': 'chg_tx90p_ANN_MK_2036-2065_rcp45_ensm_mean',
                '2066-2095': 'chg_tx90p_ANN_MK_2066-2095_rcp45_ensm_mean'
              },
              'rcp85': {
                '2016-2045' : 'chg_tx90p_ANN_MK_2016-2045_rcp85_ensm_mean',
                '2036-2065': 'chg_tx90p_ANN_MK_2036-2065_rcp85_ensm_mean',
                '2066-2095': 'chg_tx90p_ANN_MK_2066-2095_rcp85_ensm_mean'
              }
            },

          },

        climateAbsoluteLegend: [
          {
              'name': 'cdd-absolute',
              'colors': ['#018571','#72C5B8','#72C5B8','#A7DBD3','#DBEDEA','#F1EADB','#E7D3A5','#D9B772','#C08C46','#A6611A'],
              'labels':['0', '15', '30', '45', '60', '75', '90', '105', '120', '135'],
          },
          {
              'name': 'cwd-absolute',
              'colors': ['#FDE725','#B5DE2C','#6CCE59','#35B779','#1E9E89','#25838E','#31688E','#3E4A89','#472878','#440154'],
              'labels': ['110', '138', '166', '195', '223', '251', '280', '308', '336', '365']
          },
          {
              'name': 'gddgrow10-absolute',
              'colors': ['#5E3C99','#836DB3','#A99FCC','#C9C5DF','#E8E7EF','#F9E9D6','#FBCD94','#FBAF58','#F1882C','#E66101'],
              'labels': ['0', '900', '1820', '2730', '3640', '4555', '5460', '6380', '7290', '8200']
          },
          {
              'name': 'gsl-absolute',
              'colors': ['#CA0020','#DD494B','#F09377','#F5C1A9','#F7E5DD','#E1ECF2','#B4D6E7','#82BCD9','#4396C5','#0571B0'],
              'labels': ['120', '147', '174', '201', '228', '256', '283', '310', '337', '365']
          },
          {
              'name': 'spei-absolute',
              'colors': ['#0571B0','#2D89BD','#55A1CB','#7EB9D8','#A1CCE2','#BEDBE9','#DAE9F0','#F7F7F7','#F7E0D6','#F6C8B4','#F5B193','#EE8D74','#E25E58','#D62F3C','#CA0020'],
              'labels': ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45','50', '55', '60', '65', '70']
          },
          {
              'name': 'spi-absolute',
              'colors': ['#0571B0','#2D89BD','#55A1CB','#7EB9D8','#A1CCE2','#BEDBE9','#DAE9F0','#F7F7F7','#F7E0D6','#F6C8B4','#F5B193','#EE8D74','#E25E58','#D62F3C','#CA0020'],
              'labels': ['0', '9', '6', '9', '12', '15', '18', '21', '24', '27','30', '33', '36', '39', '42']
          },
          {
              'name': 'r20mm-absolute',
              'colors': ['#FDE725','#BCDF27','#7AD251','#43BF70','#22A884','#20908D','#29788E','#345F8D','#404387','#482475','#440154'],
              'labels': ['0', '11', '22', '33', '44', '55', '66', '77', '88', '99','110']
          },
          {
              'name': 'tmm-absolute',
              'colors': ['#1A9641','#4DAF50','#80C75F','#AEDD72','#CFEB91','#EFF9B4','#FFF1AF','#FED38C','#FEB66A','#F3854E','#E54F35','#D7191C'],
              'labels': ['0', '3', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33']
          },
          {
              'name': 'tn10p-historical-absolute',
              'colors': ['#7B3294','#9760AC','#B48EC3','#CDB6D7','#E2D7E7','#F7F7F7','#D7ECD5','#B6E1B2','#85CB8B','#42A961','#008837'],
              'labels': ['9.0', '9.2', '9.4', '9.6', '9.8', '10.0', '10.2', '10.4', '10.6', '10.8', '11.0']
          },
          {
              'name': 'tn10p-absolute',
              'colors': ['#7B3294','#9760AC','#B48EC3','#CDB6D7','#E2D7E7','#F7F7F7','#D7ECD5','#B6E1B2','#85CB8B','#42A961','#008837'],
              'labels': ['0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1']
          },
          {
              'name': 'tnn-absolute',
              'colors': ['#4DAC26','#6EBD43','#8FCD61','#B0DD7F','#C7E6A0','#DAEDC3','#EEF4E6','#F7EDF3','#F5D9EA','#F3C5E1','#EFAAD4','#E57BBC','#DB4BA3','#D01C8B'],
              'labels': ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26']
          },
          {
              'name': 'tx90p-absolute',
              'colors': ['#4DAC26','#8FCD61','#C7E6A0','#DAEDC3','#EEF4E6','#F7EDF3','#F5D9EA','#F3C5E1','#E57BBC','#D01C8B'],
              'labels': ['55', '60', '65', '70', '75', '80', '85', '90', '95', '100']
          },
          {
              'name': 'txx-absolute',
              'colors': ['#2B83BA','#5EA7B1','#91CBA9','#BCE4AA','#DEF2B4','#FFFFBF','#FFDF9A','#FEBE74','#F69053','#E75437','#D7191C'],
              'labels': ['10', '14', '18', '22', '26', '30', '34', '38', '42', '46', '50']
          }

        ],

        climateChangeLegend: [
          {
              'name': 'cdd-change',
              'colors': ['#018571','#34A291','#67BFB1','#97D5CC','#C6E5E1','#F8F8F8','#EDE1C5','#E4CC95','#D6B472','#BD8841','#A6611A'],
              'labels':['-15.0', '-11.5', '-8.0', '-4.5', '-1.0', '2.5', '6.0', '9.5', '13.0', '16.5', '20.0'],
          },
          {
              'name': 'cwd-change',
              'colors': ['#FDE725','#BCDF27','#7AD251','#43BF70','#34AF8E','#20908D','#29788E','#345F8D','#404387','#52317D','#440154'],
              'labels':['-110.0', '-94.5', '-79.0', '63.5', '-48.0', '-32.5', '-17.0', '-1.5', '14.0', '29.5', '45.0'],
          },
          {
              'name': 'gddgrow10-change',
              'colors': ['#5E3C99','#8068B0','#A195C7','#C0BADA','#DCD9E9','#F7F7F7','#FADEBC','#FCC581','#F9A74F','#F08428','#E66101'],
              'labels':['0', '150', '300', '450', '600', '750', '900', '1050', '1200', '1350', '1500'],
          },
          {
              'name': 'gsl-change',
              'colors': ['#CA0020','#DD494B','#F09377','#F5C1A9','#F7E5DD','#F7F7F7','#E1ECF2','#B4D6E7','#82BCD9','#4396C5','#0571B0'],
              'labels':['0', '11', '22', '33', '44', '55', '66', '77', '88', '99','110'],
          },
          {
              'name': 'spi-change',
              'colors': ['#CA0020','#DD494B','#F09377','#F5C1A9','#F7E5DD','#F7F7F7','#E1ECF2','#B4D6E7','#82BCD9','#4396C5','#0571B0'],
              'labels':['-20', '-14', '-8', '-2', '4', '10', '16', '22', '28', '34', '40'],
          },
          {
              'name': 'spei-change',
              'colors': ['#CA0020','#DD494B','#F09377','#F5C1A9','#F7E5DD','#F7F7F7','#E1ECF2','#B4D6E7','#82BCD9','#4396C5','#0571B0'],
              'labels':['60.0', '52.5', '45.0', '37.5', '30.0', '22.5', '15.0', '7.5', '0', '-7.5', '-15.0'],
          },
          {
              'name': 'r20mm-change',
              'colors': ['#FDE725','#BCDF27','#7AD251','#43BF70','#22A884','#20908D','#29788E','#345F8D','#404387','#482475','#440154'],
              'labels':['0', '3', '6', '9', '12', '15', '18', '21', '24', '27', '30'],
          },
          {
              'name': 'tmm-change',
              'colors': ['#1A9641','#4DAF50','#80C75F','#AEDD72','#CFEB91','#FFF1AF','#FED38C','#FEB66A','#F3854E','#E54F35','#D7191C'],
              'labels':['0.0', '0.3', '0.6', '0.9', '1.2', '1.5', '1.8', '2.1', '2.4', '2.7', '4.0'],
          },
          {
              'name': 'tn10p-change',
              'colors': ['#7B3294','#9760AC','#B48EC3','#CDB6D7','#E2D7E7','#F7F7F7','#D7ECD5','#B6E1B2','#85CB8B','#42A961','#008837'],
              'labels':['-11.0', '-10.8', '-10.6', '-10.4', '-10.2', '-10.0', '-9.8', '-9.6', '-9.4', '-9.2', '-9.0'],
          },
          {
              'name': 'tnn-change',
              'colors': ['#4DAC26','#8FCD61','#C7E6A0','#DAEDC3','#EEF4E6','#F7F7F7','#F7EDF3','#F5D9EA','#F3C5E1','#E57BBC','#D01C8B'],
              'labels':['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],

          },
          {
              'name': 'tx90p-change',
              'colors': ['#4DAC26','#8FCD61','#C7E6A0','#DAEDC3','#EEF4E6','#F7F7F7','#F7EDF3','#F5D9EA','#F3C5E1','#E57BBC','#D01C8B'],
              'labels':['40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90'],
          },
          {
              'name': 'txx-change',
              'colors': ['#2B83BA','#5EA7B1','#91CBA9','#BCE4AA','#DEF2B4','#FFFFBF','#FFDF9A','#FEBE74','#F69053','#E75437','#D7191C'],
              'labels':['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],
          }
        ]


};

angular.module('mekongDroughtandCropWatch')
.constant('appSettings', settings);

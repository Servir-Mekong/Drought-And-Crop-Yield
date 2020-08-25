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
            'name': 'Visible and Shortwave Infrared Drought Index (VSDI)',
            'value': 'vsdi'
        },
        {
            'name': 'Moisture Stress Index (MSI)',
            'value': 'msi'
        },
        {
            'name': 'Atmospherically Resistant Vegetation Index (ARVI)',
            'value': 'arvi'
        },
        {
          'name': 'Soil-adjusted Vegetation Index (SAVI)',
          'value': 'savi'
        },
        {
            'name': 'Enhanced Vegetation Index (EVI)',
            'value': 'evi'
        },
        {
            'name': 'Keetch–Byram Drought Index (KBDI)',
            'value': 'kbdi'
        },
        {
            'name': 'Normalized Difference Vegetation Index (NDVI)',
            'value': 'ndvi'
        }
    ],
    periodicity: [
      {
        'name': '1 Week',
        'value': '1week'
      },
      {
        'name': '1 Month',
        'value': '1month'
      },
      {
        'name': '3 Months',
        'value': '3month'
    }],
    months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    downloadServerURL: 'ftp://ftpuser:gvamuru@203.146.112.247',


};

/*var myanmarPrimitiveClasses = JSON.parse(JSON.stringify(settings.myanmarFRALandCoverClasses));
for (var i = 0; i <= myanmarPrimitiveClasses.length - 1; i++) {
    delete myanmarPrimitiveClasses[i].color;
}

settings.myanmarPrimitiveClasses = myanmarPrimitiveClasses;
*/
angular.module('landcoverportal')
.constant('appSettings', settings);

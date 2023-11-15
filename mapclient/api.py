# -*- coding: utf-8 -*-
from .core import GEEApi
from django.conf import settings
from django.http import JsonResponse

def api(request):

    get = request.GET.get
    action = get('action', '')

    if action:
        public_methods = ['get-map-id', 'get-data', 'get-date', 'get-map-current-id', 'get-current-date', 'get-outlook-map-id', 'get-outlook-date', 'get-summary', 
        'get-crop-yield', 'get-feature-articles', 'get-knowledge-center', 'get-climate-data', 'get-crop-map-id', 'get-download-url', 'get-current-date-crop']
        if action in public_methods:
            dataset = get('dataset', '')
            type = get('type', '')
            date = get('date', '')
            province = get('province', '')
            areaid0 = get('areaid0', '')
            areaid1 = get('areaid1', '')
            periodicity = get('periodicity', '')
            img_id = get('img_id', '')
            climate_scenarios = get('climate_scenarios', '')
            climate_type = get('climate_type', '')
            core = GEEApi()
            if action == 'get-data':
                data = core.get_mekong_data(dataset, type, date, areaid0, areaid1, periodicity)
            elif action == 'get-date':
                data = core.get_available_date(dataset)
            elif action == 'get-map-id':
                data = core.get_map_id(date=date, dataset=dataset)
            elif action == 'get-map-current-id':
                data = core.get_map_current_id(date=date)
            elif action == 'get-current-date':
                data = core.get_date()
            elif action == 'get-outlook-map-id':
                data = core.get_outlook_map_id(date=date)
            elif action == 'get-outlook-date':
                data = core.get_date_outlook()
            elif action == 'get-summary':
                data = core.get_drought_summary()
            elif action == 'get-crop-yield':
                data = core.get_crop_yield(province=province)
            elif action == 'get-feature-articles':
                data = core.get_feature_articles()
            elif action == 'get-knowledge-center':
                data = core.get_knowledge_center()
            elif action == 'get-climate-data':
                #self, typeArea, areaid0, areaid1, img_id, climateType, climatePeriod
                data = core.get_climate_data(type, areaid0, areaid1, img_id, climate_type, climate_scenarios)
            elif action == 'get-crop-map-id':
                data = core.get_crop_map_id(date=date, province = province)
            elif action == 'get-download-url':
                data = core.get_download_url_crop(date=date)
            elif action == 'get-current-date-crop':
                data = core.get_date_crop()

            return JsonResponse(data, safe=False)

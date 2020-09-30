# -*- coding: utf-8 -*-
from celery.result import AsyncResult
from .core import GEEApi
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
import json
import time

def api(request):

    get = request.GET.get
    action = get('action', '')

    if action:
        public_methods = ['get-map-id', 'get-data', 'get-date', 'get-map-current-id', 'get-current-date', 'get-outlook-map-id', 'get-outlook-date']
        if action in public_methods:
            dataset = get('dataset', '')
            type = get('type', '')
            date = get('date', '')
            areaid0 = get('areaid0', '')
            areaid1 = get('areaid1', '')
            periodicity = get('periodicity', '')
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

            return JsonResponse(data, safe=False)

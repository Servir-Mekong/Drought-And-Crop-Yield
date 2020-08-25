# -*- coding: utf-8 -*-
from celery.result import AsyncResult
from mapclient.core import get_mekong_data, get_date_list
from django.conf import settings
from django.http import JsonResponse
from datetime import datetime
import json
import time

def api(request):

    get = request.GET.get
    action = get('action', '')

    if action:
        public_methods = ['get-data', 'get-date']
        if action in public_methods:
            dataset = get('dataset', '')
            type = get('type', '')
            date = get('date', '')
            areaid0 = get('areaid0', '')
            areaid1 = get('areaid1', '')
            periodicity = get('periodicity', '')
            if action == 'get-data':
                data = get_mekong_data(dataset, type, date, areaid0, areaid1, periodicity)
            elif action == 'get-date':
                data = get_date_list(dataset)

            return JsonResponse(data, safe=False)

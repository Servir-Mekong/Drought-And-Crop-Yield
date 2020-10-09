# -*- coding: utf-8 -*-

import httplib2
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.views.decorators.http import require_POST

def home(request):
    return render(request, 'map.html', {})

def map(request):
    return render(request, 'map.html', {})

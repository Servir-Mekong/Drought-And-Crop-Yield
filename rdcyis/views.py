# -*- coding: utf-8 -*-

import httplib2
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.views.decorators.http import require_POST

def home(request):
    return render(request, 'home.html', {})

def map(request):
    return render(request, 'map.html', {})

def crop(request):
    return render(request, 'crop.html', {})

def report(request):
    return render(request, 'report.html', {})

def featureArticles(request):
    return render(request, 'feature-articles.html', {})

def climateStudies(request):
    return render(request, 'climate-studies.html', {})

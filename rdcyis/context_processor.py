# -*- coding: utf-8 -*-

from django.conf import settings

def variable_settings(request):
    return {
        'GOOGLE_ANALYTICS_ID': settings.GOOGLE_ANALYTICS_ID,
    }

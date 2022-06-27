"""rdcyis URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from django.conf import settings
from django.views.static import serve
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from .views import home, map, report, crop, featureArticles, climateStudies
from mapclient import api as mapclient_api
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^$', home),
    url(r'^home/', home),
    url(r'^crop/', crop),
    url(r'^map/', map),
    url(r'^report/', report),
    url(r'^feature-articles/', featureArticles),
    url(r'^climate-studies/', climateStudies),
    url(r'^api/mapclient/$', mapclient_api.api),
]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

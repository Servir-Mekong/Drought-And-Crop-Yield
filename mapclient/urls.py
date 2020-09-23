from django.conf.urls import include, url
from . import  api
from oauth2client.contrib.django_util.site import urls as oauth2_urls

urlpatterns = [
    url(r'^map/', views.index),
    url(r'^oauth2/', include(oauth2_urls)),
    url(r'^api/$', api.api),
]

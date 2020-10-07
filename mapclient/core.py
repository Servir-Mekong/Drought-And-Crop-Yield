
# -*- coding: utf-8 -*-
from django.core import serializers
from datetime import datetime
from datetime import datetime, timedelta
import numpy as np
import base64
from django.conf import settings
import ee, json,sys, os, time
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from ee.ee_exception import EEException
from django.db import connection
import datetime as DT
import psycopg2
import gspread
from oauth2client.service_account import ServiceAccountCredentials


# -----------------------------------------------------------------------------
class GEEApi():

    """ Google Earth Engine API """

    def __init__(self):

        ee.Initialize(settings.EE_CREDENTIALS)
        #ee.Initialize()

        WEST, SOUTH, EAST, NORTH = 92.0, 9.5, 101.5, 29
        BOUNDING_BOX = (WEST,SOUTH,EAST,NORTH)

        self.MKBoundary = ee.ImageCollection(settings.MKBOUNDARY)
        self.MKADM0 = ee.ImageCollection(settings.MKADM0)
        self.MKADM1 = ee.ImageCollection(settings.MKADM1)
        self.MekongRiverBasin = ee.ImageCollection(settings.MEKONGRIVERBASIN)

        #-------------------RHEAS BASE-------------------------//
        self.baseflow = ee.ImageCollection(settings.BASEFLOW)
        self.dryspells = ee.ImageCollection(settings.DRYSPELLS)
        self.evap = ee.ImageCollection(settings.EVAP)
        self.front_rcdi = ee.ImageCollection(settings.FRONT_RCDI)
        self.pet_natveg = ee.ImageCollection(settings.PET_NATVEG)
        self.rainf = ee.ImageCollection(settings.RAINF)
        self.rel_humid = ee.ImageCollection(settings.REL_HUMID)
        self.rootmoist = ee.ImageCollection(settings.ROOTMOIST)
        self.runoff = ee.ImageCollection(settings.RUNOFF)
        self.severity = ee.ImageCollection(settings.SEVERITY)
        self.smdi = ee.ImageCollection(settings.SMDI)
        self.soil_moist = ee.ImageCollection(settings.SOIL_MOIST)
        self.soil_temp = ee.ImageCollection(settings.SOIL_TEMP)
        self.spi1 = ee.ImageCollection(settings.SPI1)
        self.spi3 = ee.ImageCollection(settings.SPI3)
        self.sri1 = ee.ImageCollection(settings.SRI1)
        self.sri3 = ee.ImageCollection(settings.SRI3)
        self.surf_temp = ee.ImageCollection(settings.SURF_TEMP)

        #//-------------------EO BASE-------------------------//
        self.VSDI = ee.ImageCollection(settings.VSDI)
        self.MSI = ee.ImageCollection(settings.MSI)
        self.ARVI = ee.ImageCollection(settings.ARVI)
        self.SAVI = ee.ImageCollection(settings.SAVI)
        self.EVI = ee.ImageCollection(settings.EVI)
        self.KBDI = ee.ImageCollection(settings.KBDI)
        self.NDVI = ee.ImageCollection(settings.NDVI)

        self.masklayer = ee.Image("projects/servir-mekong/EODrought/LULCMasks/LandCovMask500");
        self.maskedArea  = self.masklayer.eq(1);
        self.maskedArea = self.masklayer.updateMask(self.maskedArea)



        self.sld_currntDroght ='''<RasterSymbolizer>
              '<ColorMap type="intervals" extended="false" >'
                '<ColorMapEntry color="#C3C3C3" quantity="0" label="No Data (-9999 or nodata)"/>'
                '<ColorMapEntry color="#880015" quantity="2000" label="EXD (0.0 - 0.2)" />'
                '<ColorMapEntry color="#B97A57" quantity="4000" label="SED (0.2 - 0.4)" />'
                '<ColorMapEntry color="#F89F1D" quantity="8000" label="MOD (0.4 - 0.8)" />'
                '<ColorMapEntry color="#88A541" quantity="10000" label="No Drought (> 0.8)" />'
              '</ColorMap>'
            '</RasterSymbolizer>'''

        self.sld_outlooksDroght ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#88A541" quantity="0" label="Normal" />'
            '<ColorMapEntry color="#F89F1D" quantity="1" label="Watch" />'
            '<ColorMapEntry color="#B97A57" quantity="2" label="Warning" />'
            '<ColorMapEntry color="#880015" quantity="3" label="Alert" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_vsdi ='''<RasterSymbolizer>
              '<ColorMap type="intervals" extended="false" >'
                '<ColorMapEntry color="#C3C3C3" quantity="0" label="No Data (-9999 or nodata)"/>'
                '<ColorMapEntry color="#880015" quantity="2000" label="EXD (0.0 - 0.2)" />'
                '<ColorMapEntry color="#B97A57" quantity="4000" label="SED (0.2 - 0.4)" />'
                '<ColorMapEntry color="#F89F1D" quantity="8000" label="MOD (0.4 - 0.8)" />'
                '<ColorMapEntry color="#88A541" quantity="10000" label="No Drought (> 0.8)" />'
              '</ColorMap>'
            '</RasterSymbolizer>'''

        self.sld_arvi = 'E85B3A,F99E59,FEC981,FFEDAB,F7FCDF,C4E687,97D265,58B453,1A9641'
        self.sld_savi = 'E85B3A,F99E59,FEC981,FFEDAB,F7FCDF,C4E687,97D265,58B453,1A9641'
        self.sld_evi = 'E85B3A,F99E59,FEC981,FFEDAB,F7FCDF,C4E687,97D265,58B453,1A9641'
        self.sld_ndvi = 'E85B3A,F99E59,FEC981,FFEDAB,F7FCDF,C4E687,97D265,58B453,1A9641'
        self.sld_ndvi_ano = 'E85B3A,F99E59,FEC981,FFEDAB,F7FCDF,C4E687,97D265,58B453,1A9641'

        self.sld_kbdi ='''<RasterSymbolizer>'
            '<ColorMap type="intervals" extended="false" >'
              '<ColorMapEntry color="#C3C3C3" quantity="-9999" label="No Data (-9999 or nodata)"/>'
              '<ColorMapEntry color="#88A541" quantity="0" label="No Drought (less than 399)" />'
              '<ColorMapEntry color="#F89F1D" quantity="400" label="MOD (400 - 499)" />'
              '<ColorMapEntry color="#B97A57" quantity="500" label="SED (500 - 649)" />'
              '<ColorMapEntry color="#880015" quantity="650" label="EXD (650 - 800)" />'
            '</ColorMap>'
          '</RasterSymbolizer>'''

        self.sld_cdi ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#FFFFFF" quantity="0" label="Normal" />'
            '<ColorMapEntry color="#F89F1D" quantity="1" label="Watch" />'
            '<ColorMapEntry color="#B97A57" quantity="2" label="Warning" />'
            '<ColorMapEntry color="#880015" quantity="3" label="Alert" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_spi1 ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#880015" quantity="-2.0" label="EXD (less than -2.0)" />'
            '<ColorMapEntry color="#B97A57" quantity="-1.50" label="SED (-1.5 - -1.99)" />'
            '<ColorMapEntry color="#F89F1D" quantity="-1.0" label="MOD (-1.0 - -1.49)" />'
            '<ColorMapEntry color="#FFFFFF" quantity="10" label="Normal or Wet (gt -0.99)" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_spi3 ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#880015" quantity="-2.0" label="EXD (less than  -2.0)" />'
            ''<ColorMapEntry color="#B97A57" quantity="-1.50" label="SED (-1.5 - -1.99)" />'
            '<ColorMapEntry color="#F89F1D" quantity="-1.0" label="MOD (-1.0 - -1.49)" />'
            '<ColorMapEntry color="#FFFFFF" quantity="10" label="Normal or Wet (gt -0.99)" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_sri1 ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#880015" quantity="-2.0" label="EXD (less than  -2.0)" />'
            '<ColorMapEntry color="#B97A57" quantity="-1.50" label="SED (-1.5 - -1.99)" />'
            '<ColorMapEntry color="#F89F1D" quantity="-1.0" label="MOD (-1.0 - -1.49)" />'
            '<ColorMapEntry color="#FFFFFF" quantity="10" label="Normal or Wet (gt -0.99)" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_sri3 ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#880015" quantity="-2.0" label="EXD (less than -2.0)" />'
            '<ColorMapEntry color="#B97A57" quantity="-1.50" label="SED (-1.5 - -1.99)" />'
            '<ColorMapEntry color="#F89F1D" quantity="-1.0" label="MOD (-1.0 - -1.49)" />'
            '<ColorMapEntry color="#FFFFFF" quantity="10" label="Normal or Wet (gt -0.99)" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_smdi ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#880015" quantity="-2.0" label="EXD (less than -2.0)" />'
            '<ColorMapEntry color="#B97A57" quantity="-1.50" label="SED (-1.5 - -1.99)" />'
            '<ColorMapEntry color="#F89F1D" quantity="-1.0" label="MOD (-1.0 - -1.49)" />'
            '<ColorMapEntry color="#FFFFFF" quantity="10" label="Normal or Wet (gt -0.99)" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_soilmoist ='''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#880015" quantity="5" label="EXD (0 - 5)"/>'
            '<ColorMapEntry color="#B97A57" quantity="10" label="SED (6 - 10)" />'
            '<ColorMapEntry color="#F89F1D" quantity="20" label="MOD (11 - 20)" />'
            '<ColorMapEntry color="#FFFFFF" quantity="10000" label="Normal or Wet (gt 21)" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_msi = '1A9641, 58B453, 97D265, C4E687, F7FCDF, FFEDAB, FEC981, F99E59, E85B3A'

        self.sld_severity = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#FFFFB2" quantity="10" label="0 - 10"/>'
            '<ColorMapEntry color="#FEE78A" quantity="20" label="10 - 20" />'
            '<ColorMapEntry color="#FED165" quantity="30" label="20 - 30" />'
            '<ColorMapEntry color="#FDB751" quantity="40" label="30 - 40" />'
            '<ColorMapEntry color="#FD9B43" quantity="50" label="40 - 50"/>'
            '<ColorMapEntry color="#FA7A35" quantity="60" label="50 - 60" />'
            '<ColorMapEntry color="#F45629" quantity="70" label="60 - 70" />'
            '<ColorMapEntry color="#EA331F" quantity="80" label="70 - 80" />'
            '<ColorMapEntry color="#D31A23" quantity="90" label="80 - 90" />'
            '<ColorMapEntry color="#BC0022" quantity="100" label="90 - 100" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_dryspells = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#FFFFD4" quantity="2" label="0 - 2"/>'
            '<ColorMapEntry color="#FEE5A5" quantity="4" label="2 - 4" />'
            '<ColorMapEntry color="#FEC36C" quantity="6" label="4 - 6" />'
            '<ColorMapEntry color="#FE9929" quantity="8" label="6 - 8" />'
            '<ColorMapEntry color="#E46F12" quantity="10" label="8 - 10" />'
            '<ColorMapEntry color="#C3500A" quantity="12" label="10 - 12" />'
            '<ColorMapEntry color="#993404" quantity="14" label="12 - 14" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_surf_temp = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#0370AF" quantity="15" label="0 - 10"/>'
            '<ColorMapEntry color="#348DBF" quantity="20" label="10 - 13" />'
            '<ColorMapEntry color="#75B4D4" quantity="21" label="13 - 16" />'
            '<ColorMapEntry color="#A5CEE2" quantity="22" label="16 - 19" />'
            '<ColorMapEntry color="#CDE2EC" quantity="23" label="19 - 22"/>'
            '<ColorMapEntry color="#F6F6F6" quantity="24" label="22 - 25" />'
            '<ColorMapEntry color="#F4D5C7" quantity="26" label="25 - 28" />'
            '<ColorMapEntry color="#F4B599" quantity="28" label="28 - 31" />'
            '<ColorMapEntry color="#EB846E" quantity="29" label="31 - 34"/>'
            '<ColorMapEntry color="#DA4247" quantity="30" label="34 - 36" />'
            '<ColorMapEntry color="#CA0020" quantity="100" label="36 +" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_rootmoist = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#C9001E" quantity="100" label="Less than 100"/>'
            '<ColorMapEntry color="#DA3F41" quantity="200" label="100 - 200" />'
            '<ColorMapEntry color="#EF9277" quantity="300" label="200 - 300" />'
            '<ColorMapEntry color="#F4B4A2" quantity="400" label="300 - 400" />'
            '<ColorMapEntry color="#F6E4DD" quantity="500" label="400 - 500"/>'
            '<ColorMapEntry color="#E0EBF1" quantity="600" label="500 - 600" />'
            '<ColorMapEntry color="#B3D5E6" quantity="700" label="600 - 700" />'
            '<ColorMapEntry color="#82BBD8" quantity="800" label="700 - 800" />'
            '<ColorMapEntry color="#4396C4" quantity="900" label="800 - 900"/>'
            '<ColorMapEntry color="#0571B0" quantity="1000" label="900 - 1000" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_soil_temp = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#2C7BB6" quantity="5" label="Less than 8"/>'
            '<ColorMapEntry color="#569AC7" quantity="10" label="8 - 10" />'
            '<ColorMapEntry color="#A0CBE2" quantity="15" label="10 - 12" />'
            '<ColorMapEntry color="#ABD9E9" quantity="20" label="12 - 14" />'
            '<ColorMapEntry color="#E5F3EF" quantity="21" label="14 - 16"/>'
            '<ColorMapEntry color="#E2F2CC" quantity="22" label="16 - 18" />'
            '<ColorMapEntry color="#FFFFBF" quantity="23" label="18 - 20" />'
            '<ColorMapEntry color="#FEE49F" quantity="24" label="20 - 22" />'
            '<ColorMapEntry color="#FDC77B" quantity="26" label="22 - 24"/>'
            '<ColorMapEntry color="#FDAA5B" quantity="28" label="24 - 26" />'
            '<ColorMapEntry color="#F07C4A" quantity="29" label="26 - 28" />'
            '<ColorMapEntry color="#E34A33" quantity="30" label="28 - 30"/>'
            '<ColorMapEntry color="#D7191C" quantity="100" label="30 +" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_baseflow = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#FFFFCC" quantity="2" label="Less than 0"/>'
            '<ColorMapEntry color="#DFF2C4" quantity="4" label="0 - 0.2" />'
            '<ColorMapEntry color="#C0E6BC" quantity="6" label="0.2 - 0.4" />'
            '<ColorMapEntry color="#A1DAB4" quantity="8" label="0.4 - 0.6" />'
            '<ColorMapEntry color="#81CEB9" quantity="10" label="0.6 - 0.8"/>'
            '<ColorMapEntry color="#61C2BE" quantity="12" label="0.8 - 1.0" />'
            '<ColorMapEntry color="#41B6C4" quantity="14" label="1.0 - 1.4" />'
            '<ColorMapEntry color="#3AA3C0" quantity="16" label="1.4 - 1.8" />'
            '<ColorMapEntry color="#3391BC" quantity="18" label="1.8 - 2.0"/>'
            '<ColorMapEntry color="#2C7FB8" quantity="20" label="2.0 - 3.0" />'
            '<ColorMapEntry color="#2965AC" quantity="22" label="3.0 - 4.0" />'
            '<ColorMapEntry color="#274DA0" quantity="24" label="4.0 - 5.0"/>'
            '<ColorMapEntry color="#253494" quantity="1000" label="30 +" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_pet_natveg = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#F0F9E8" quantity="1" label="Less than 1"/>'
            '<ColorMapEntry color="#D8F0D5" quantity="2" label="1 - 2" />'
            '<ColorMapEntry color="#C0E7C1" quantity="3" label="2 - 3" />'
            '<ColorMapEntry color="#A5DCBF" quantity="4" label="3 - 4" />'
            '<ColorMapEntry color="#89D2C2" quantity="5" label="4 - 5"/>'
            '<ColorMapEntry color="#6EC3C6" quantity="6" label="5 - 6" />'
            '<ColorMapEntry color="#56B0C8" quantity="7" label="6 - 7" />'
            '<ColorMapEntry color="#3C9CC7" quantity="8" label="7 - 8" />'
            '<ColorMapEntry color="#2282BA" quantity="9" label="8 - 9"/>'
            '<ColorMapEntry color="#0868AC" quantity="100" label="9 +" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_rainf = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#FFFFFF" quantity="1" label="0 - 1"/>'
            '<ColorMapEntry color="#E5B42C" quantity="2" label="1 - 2" />'
            '<ColorMapEntry color="#E3B022" quantity="3" label="2 - 3" />'
            '<ColorMapEntry color="#F2B464" quantity="4" label="3 - 4" />'
            '<ColorMapEntry color="#F2B464" quantity="5" label="4 - 5"/>'
            '<ColorMapEntry color="#F3E976" quantity="10" label="5 - 10" />'
            '<ColorMapEntry color="#91CE7E" quantity="20" label="10 - 20" />'
            '<ColorMapEntry color="#89CE74" quantity="30" label="20 - 30" />'
            '<ColorMapEntry color="#43BE87" quantity="40" label="30 - 40"/>'
            '<ColorMapEntry color="#34B485" quantity="50" label="40 - 50" />'
            '<ColorMapEntry color="#30B282" quantity="60" label="50 - 60" />'
            '<ColorMapEntry color="#069B42" quantity="70" label="60 - 70"/>'
            '<ColorMapEntry color="#069B42" quantity="100" label="70 +" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_runoff = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#A6621C" quantity="5" label="Less than 0.0"/>'
            '<ColorMapEntry color="#BA843E" quantity="10" label="0.0 - 0.1" />'
            '<ColorMapEntry color="#CFA762" quantity="20" label="0.1 - 0.2" />'
            '<ColorMapEntry color="#E1C687" quantity="30" label="0.2 - 0.3" />'
            '<ColorMapEntry color="#E9D9B3" quantity="40" label="0.3 - 0.4"/>'
            '<ColorMapEntry color="#F1EBDF" quantity="50" label="0.4 - 0.5" />'
            '<ColorMapEntry color="#DFEDEB" quantity="60" label="0.5 - 0.6" />'
            '<ColorMapEntry color="#B5DFD8" quantity="70" label="0.6 - 0.7" />'
            '<ColorMapEntry color="#8AD0C5" quantity="80" label="0.7 - 0.8"/>'
            '<ColorMapEntry color="#5DB9AB" quantity="90" label="0.8 - 0.9" />'
            '<ColorMapEntry color="#5DB9AB" quantity="100" label="0.9 - 1.0" />'
            '<ColorMapEntry color="#018571" quantity="1000" label="10 +"/>'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_evap = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#51125F" quantity="2" label="Less than 0.0"/>'
            '<ColorMapEntry color="#482172" quantity="4" label="0.0 - 0.3" />'
            '<ColorMapEntry color="#423E84" quantity="6" label="0.3 - 0.6" />'
            '<ColorMapEntry color="#38588B" quantity="8" label="0.6 - 0.9" />'
            '<ColorMapEntry color="#2C6F8E" quantity="10" label="0.9 - 1.2"/>'
            '<ColorMapEntry color="#24848E" quantity="12" label="1.2 - 1.6" />'
            '<ColorMapEntry color="#1E9B89" quantity="14" label="1.6 - 2.0" />'
            '<ColorMapEntry color="#2AB07E" quantity="16" label="2.0 - 2.5" />'
            '<ColorMapEntry color="#50C469" quantity="18" label="2.5 - 3.0"/>'
            '<ColorMapEntry color="#85D44A" quantity="20" label="3.0 - 3.5" />'
            '<ColorMapEntry color="#C1DF23" quantity="22" label="3.5 - 4.0" />'
            '<ColorMapEntry color="#FDE725" quantity="100" label="4.0 +"/>'
          '</ColorMap>'
        '</RasterSymbolizer>'''

        self.sld_rel_humid = '''<RasterSymbolizer>'
          '<ColorMap type="intervals" extended="false" >'
            '<ColorMapEntry color="#7C3595" quantity="10" label="Less than 10"/>'
            '<ColorMapEntry color="#9B65AE" quantity="20" label="10 - 20" />'
            '<ColorMapEntry color="#BA98C9" quantity="30" label="20 - 30" />'
            '<ColorMapEntry color="#D4C1DD" quantity="40" label="30 - 40" />'
            '<ColorMapEntry color="#ECE5EF" quantity="50" label="40 - 50"/>'
            '<ColorMapEntry color="#E5F1E4" quantity="60" label="50 - 60" />'
            '<ColorMapEntry color="#C1E5BD" quantity="70" label="60 - 70" />'
            '<ColorMapEntry color="#95D295" quantity="80" label="70 - 80" />'
            '<ColorMapEntry color="#4AAD66" quantity="90" label="80 - 90"/>'
            '<ColorMapEntry color="#008837" quantity="100" label="90 +" />'
          '</ColorMap>'
        '</RasterSymbolizer>'''


        # Class and Inde
        self.MAP_CLASSES = [
            {
                'name': 'front_gcdi',
                'value': self.sld_currntDroght,
                'min':0,
                'max':10000,
                'sld': 'True',
                'band': 'front_gcdi'
            },
            {
                'name': 'front_rcdi',
                'value': self.sld_outlooksDroght,
                'min':0,
                'max':10,
                'sld': 'True',
                'band': 'front_rcdi'
            },
            {
                'name': 'vsdi',
                'value': self.sld_vsdi,
                'min':0,
                'max':10000,
                'sld': 'True',
                'band': 'VSDI'
            },
            {
                'name': 'kbdi',
                'value': self.sld_kbdi,
                'min':0,
                'max':800,
                'sld': 'True',
                'band': 'KBDI'
            },
            {
                'name': 'cdi',
                'value': self.sld_cdi,
                'min':0,
                'max':10,
                'sld': 'True',
                'band': 'cdi'
            },
            {
                'name': 'spi1',
                'value': self.sld_spi1,
                'min':-10,
                'max':10,
                'sld': 'True',
                'band': 'spi1'
            },
            {
                'name': 'spi3',
                'value': self.sld_spi3,
                'min':-10,
                'max':10,
                'sld': 'True',
                'band': 'spi3'
            },
            {
                'name': 'sri1',
                'value': self.sld_sri1,
                'min':-10,
                'max':10,
                'sld': 'True',
                'band': 'sri1'
            },
            {
                'name': 'sri3',
                'value': self.sld_sri3,
                'min':-10,
                'max':10,
                'sld': 'True',
                'band': 'sri3'
            },
            {
                'name': 'smdi',
                'value': self.sld_smdi,
                'min':-10,
                'max':10,
                'sld': 'True',
                'band': 'smdi'
            },
            {
                'name': 'soil_moist',
                'value': self.sld_soilmoist,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'soil_moist'
            },
            {
                'name': 'msi',
                'value': self.sld_msi,
                'min':0,
                'max':30000,
                'sld': 'False',
                'band': 'MSI'
            },
            {
                'name': 'savi',
                'value': self.sld_savi,
                'min':-10000,
                'max':10000,
                'sld': 'False',
                'band': 'SAVI'
            },
            {
                'name': 'evi',
                'value': self.sld_evi,
                'min':-10000,
                'max':10000,
                'sld': 'False',
                'band': 'EVI'
            },
            {
                'name': 'ndvi',
                'value': self.sld_ndvi,
                'min':-10000,
                'max':10000,
                'sld': 'False',
                'band': 'NDVI'
            },
            {
                'name': 'ndvi_ano',
                'value': self.sld_ndvi_ano,
                'min':-20000,
                'max':20000,
                'sld': 'False',
                'band': 'ndvi_ano'
            },
            {
                'name': 'arvi',
                'value': self.sld_arvi,
                'min':-10000,
                'max':10000,
                'sld': 'False',
                'band': 'ARVI'
            },
            {
                'name': 'severity',
                'value': self.sld_severity,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'severity'
            },
            {
                'name': 'dryspells',
                'value': self.sld_dryspells,
                'min':0,
                'max':14,
                'sld': 'True',
                'band': 'dryspells'
            },
            {
                'name': 'surf_temp',
                'value': self.sld_surf_temp,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'surf_temp'
            },
            {
                'name': 'rootmoist',
                'value': self.sld_rootmoist,
                'min':0,
                'max':1000,
                'sld': 'True',
                'band': 'rootmoist'
            },
            {
                'name': 'soil_temp',
                'value': self.sld_soil_temp,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'soil_temp'
            },
            {
                'name': 'baseflow',
                'value': self.sld_baseflow,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'baseflow'
            },
            {
                'name': 'pet_natveg',
                'value': self.sld_pet_natveg,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'pet_natveg'
            },
            {
                'name': 'rainf',
                'value': self.sld_rainf,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'rainf'
            },
            {
                'name': 'runoff',
                'value': self.sld_runoff,
                'min':0,
                'max':1,
                'sld': 'True',
                'band': 'runoff'
            },
            {
                'name': 'evap',
                'value': self.sld_evap,
                'min':0,
                'max':10,
                'sld': 'True',
                'band': 'evap'
            },
            {
                'name': 'rel_humid',
                'value': self.sld_rel_humid,
                'min':0,
                'max':100,
                'sld': 'True',
                'band': 'rel_humid'
            }
        ]


    # -------------------------------------------------------------------------
    def getTileLayerUrl(self, ee_image_object):
        map_id = ee.Image(ee_image_object).getMapId()
        tile_url_template = "https://earthengine.googleapis.com/map/{mapid}/{{z}}/{{x}}/{{y}}?token={token}"
        return tile_url_template.format(**map_id)

    # -------------------------------------------------------------------------
    def get_mekong_data(self, dataset, type, date, areaid0, areaid1, periodicity):
        today = DT.date.today()
        dateStart = DT.datetime.strptime(date, "%Y-%m-%d")
        # dd/mm/YY
        # end_date = dateStart.strftime("%Y-%m-%d")
        end_date = date

        if periodicity == '1week':
            week_ago = dateStart - DT.timedelta(days=7)
            start_date = week_ago.strftime("%Y-%m-%d")
        elif periodicity == '1month':
            month_ago = dateStart - DT.timedelta(days=30)
            start_date = month_ago.strftime("%Y-%m-%d")
        elif periodicity == '3month':
            month_ago = dateStart - DT.timedelta(days=92)
            start_date = month_ago.strftime("%Y-%m-%d")
        elif periodicity == '1year':
            _ago = dateStart - DT.timedelta(days=365)
            start_date = _ago.strftime("%Y-%m-%d")

        with connection.cursor() as cursor:
            if type == 'mekong_country':
                sql = """SELECT dataset, date, max(min), max(max), max(average), time_start from eo_mekong where dataset = '"""+dataset+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' group by date, dataset, time_start order by time_start ASC"""
            elif type == 'adm0':
                sql = """SELECT dataset, date, max(min), max(max), max(average), time_start from eo_adm0 where dataset = '"""+dataset+"""' and adm0_id='"""+areaid0+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' group by date, dataset, time_start order by time_start ASC"""
            elif type == 'adm1':
                sql = """SELECT dataset, date, max(min), max(max), max(average), time_start from eo_adm1 where dataset = '"""+dataset+"""' and adm0_id='"""+areaid0+"""' and adm1_id='"""+areaid1+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' group by date, dataset, time_start order by time_start ASC"""
            elif type == 'lmr':
                sql = """SELECT dataset, date, max(min), max(max), max(average), time_start from tbl_mekongriver where dataset = '"""+dataset+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' group by date, dataset, time_start order by time_start ASC"""

            cursor.execute(sql)
            result = cursor.fetchall()
            data=[]
            for row in result:
                dataset=row[0]
                date = row[1]
                min = row[2]
                max = row[3]
                average=row[4]
                time_start=row[5]
                data.append({
                    'dataset': dataset,
                    'date': date,
                    'min': min,
                    'max': max,
                    'average': average,
                    'time_start': time_start,
                })
            connection.close()
            return data


    # -------------------------------------------------------------------------
    def get_date_list(self, dataset):
        with connection.cursor() as cursor:
            sql = """SELECT dataset, date from eo_mekong where dataset = '"""+dataset+"""' order by time_start ASC"""
            cursor.execute(sql)
            result = cursor.fetchall()
            data=[]
            for row in result:
                dataset=row[0]
                date = row[1]
                data.append({
                    'dataset': dataset,
                    'date': date
                })
            connection.close()
            return data

    # -------------------------------------------------------------------------
    def get_ImageCollection_ID(self, dataset):
        dataset = dataset.split("-")[1]
        #RHEAS_based products
        rheas_dataset = ["baseflow", "surf_temp", "sri1", "sri3", "spi1", "spi3", "soil_moist", "soil_temp", "smdi", "severity", "runoff", "rootmoist", "rel_humid", "rainf", "pet_natveg", "front_rcdi", "evap", "dryspells", "cdi"]
        if dataset.lower() in rheas_dataset:
            icid = "projects/servir-mekong/RHEASDrought/{}".format(dataset.lower())
            ic = ee.ImageCollection(icid)
        elif dataset == "evi":
            icid = "NOAA/VIIRS/001/VNP13A1"
            ic = ee.ImageCollection("NOAA/VIIRS/001/VNP13A1")
        elif dataset == "kbdi":
            icid = "UTOKYO/WTLAB/KBDI/v1"
        elif dataset == "ndvi":
            icid = "NOAA/VIIRS/001/VNP13A1"
        else:
            icid = "projects/servir-mekong/EODrought/VIIRS/{}".format(dataset.upper())
        return icid

    # -------------------------------------------------------------------------

    def get_map_id(self, date, dataset):

        icid = self.get_ImageCollection_ID(dataset)
        ic = ee.ImageCollection(icid)
        date_time_obj = datetime.strptime(date, '%Y-%m-%d')
        datetimeSec = int(round((date_time_obj - datetime(1970, 1, 1)).total_seconds()))*1000

        image = ic.filter(ee.Filter.eq("system:time_start",datetimeSec)).first()
        image = image.updateMask(self.maskedArea)

        INDEX_CLASS = {}
        for _class in self.MAP_CLASSES:
            if (_class['name'] == dataset.split("-")[1]):
                _class['name'] = dataset.split("-")[1]
                style = _class['value']
                print(_class['sld'])
                image = image.select(_class['band'])
                if (_class['sld'] == 'True'):
                    style = _class['value']
                    map_id = image.sldStyle(style).getMapId()
                else:
                    map_id = image.getMapId({
                        'min': _class['min'],
                        'max': _class['max'],
                        'palette': _class['value']
                    })

        return {
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

    # -------------------------------------------------------------------------
    def get_available_date(self, dataset):
        #-------------------RHEAS BASE-------------------------//
        icid = self.get_ImageCollection_ID(dataset)

        ic = ee.ImageCollection(icid)
        def imgDate(d):
            return ee.Date(d).format("YYYY-MM-dd")

        dates = ee.List(ic.aggregate_array("system:time_start")).map(imgDate).getInfo()

        return dates

    # -------------------------------------------------------------------------
    def get_date(self):
        ic = ee.ImageCollection(settings.VSDI).sort("system:time_start", False)
        dates = ee.List(ic.aggregate_array("system:time_start")).getInfo()
        return dates

    # -------------------------------------------------------------------------
    def get_map_current_id(self, date):

        ic = ee.ImageCollection(settings.VSDI)

        image = ic.filter(ee.Filter.eq("system:time_start",int(date))).first()
        image = image.updateMask(self.maskedArea)

        INDEX_CLASS = {}
        for _class in self.MAP_CLASSES:
            if (_class['name'] == 'vsdi'):
                style = _class['value']
                print(_class['sld'])
                image = image.select(_class['band'])
                style = _class['value']
                map_id = image.sldStyle(style).getMapId()


        return {
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

    # -------------------------------------------------------------------------
    def get_outlook_map_id(self, date):

        ic = ee.ImageCollection(settings.FRONT_RCDI)

        image = ic.filter(ee.Filter.eq("system:time_start",int(date))).first()
        image = image.updateMask(self.maskedArea)

        INDEX_CLASS = {}
        for _class in self.MAP_CLASSES:
            if (_class['name'] == 'front_rcdi'):
                style = _class['value']
                print(_class['sld'])
                image = image.select(_class['band'])
                style = _class['value']
                map_id = image.sldStyle(style).getMapId()

        return {
            'eeMapURL': str(map_id['tile_fetcher'].url_format)
        }

    # -------------------------------------------------------------------------
    def get_date_outlook(self):
        _oneMonthAgo = (datetime.today() - DT.timedelta(days = 30 )).strftime('%Y-%m-%d')
        _currentDate = datetime.today().strftime('%Y-%m-%d')
        ic = ee.ImageCollection(settings.FRONT_RCDI).filterDate(_oneMonthAgo, "2040-01-01").sort("system:time_start", False)
        dates = ee.List(ic.aggregate_array("system:time_start")).getInfo()
        return dates

    # -------------------------------------------------------------------------
    def get_drought_summary(request):
        scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
        creds = ServiceAccountCredentials.from_json_keyfile_name('credentials/privatekey.json', scope)
        client = gspread.authorize(creds)
        sheet = client.open('Drought_Summary').sheet1
        res_list = sheet.get_all_records()
        # res_list = sorted(res_list, key=lambda x: int(x['Order']), reverse=True)
        list_as_json = json.dumps(res_list)
        return list_as_json

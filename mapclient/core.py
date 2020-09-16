import ee
import psycopg2
import sys
import os
from django.db import connection
from django.conf import settings
import datetime as DT


def get_mekong_data(dataset, type, date, areaid0, areaid1, periodicity):
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
            sql = """SELECT dataset, date, min, max, average, time_start from eo_mekong where dataset = '"""+dataset+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' order by time_start ASC"""
        elif type == 'adm0':
            sql = """SELECT dataset, date, min, max, average, time_start from eo_adm0 where dataset = '"""+dataset+"""' and adm0_id='"""+areaid0+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' order by time_start ASC"""
        elif type == 'adm1':
            sql = """SELECT dataset, date, min, max, average, time_start from eo_adm1 where dataset = '"""+dataset+"""' and adm0_id='"""+areaid0+"""' and adm1_id='"""+areaid1+"""' and to_date(date,'YYYY-MM-DD') BETWEEN '"""+start_date+"""' AND '"""+end_date+"""' order by time_start ASC"""
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

def get_date_list(dataset):
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

# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-26 23:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hadiths', '0010_auto_20151229_0103'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='added_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='book',
            name='updated_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='hadith',
            name='added_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='hadith',
            name='updated_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='hadithtag',
            name='added_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='hadithtag',
            name='updated_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='added_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='updated_by',
            field=models.BigIntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='book',
            name='updated_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='hadith',
            name='updated_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='hadithtag',
            name='updated_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='updated_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

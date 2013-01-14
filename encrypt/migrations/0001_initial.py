# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'SecureData'
        db.create_table('encrypt_securedata', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(unique=True, max_length=40)),
            ('data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('encrypt', ['SecureData'])


    def backwards(self, orm):
        # Deleting model 'SecureData'
        db.delete_table('encrypt_securedata')


    models = {
        'encrypt.securedata': {
            'Meta': {'object_name': 'SecureData'},
            'data': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '40'})
        }
    }

    complete_apps = ['encrypt']
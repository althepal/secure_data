# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'SecureData.last_mod'
        db.alter_column('encrypt_securedata', 'last_mod', self.gf('django.db.models.fields.DateTimeField')(auto_now=True))

    def backwards(self, orm):

        # Changing field 'SecureData.last_mod'
        db.alter_column('encrypt_securedata', 'last_mod', self.gf('django.db.models.fields.DateField')(auto_now=True))

    models = {
        'encrypt.securedata': {
            'Meta': {'object_name': 'SecureData'},
            'data': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_mod': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '40'})
        }
    }

    complete_apps = ['encrypt']
# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'SecureData.tmp'
        db.delete_column('encrypt_securedata', 'tmp')


    def backwards(self, orm):
        # Adding field 'SecureData.tmp'
        db.add_column('encrypt_securedata', 'tmp',
                      self.gf('django.db.models.fields.TextField')(null=True),
                      keep_default=False)


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
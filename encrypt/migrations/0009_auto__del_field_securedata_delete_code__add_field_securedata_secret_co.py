# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'SecureData.delete_code'
        db.delete_column('encrypt_securedata', 'delete_code')

        # Adding field 'SecureData.secret_code'
        db.add_column('encrypt_securedata', 'secret_code',
                      self.gf('django.db.models.fields.CharField')(default='a', max_length=20),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'SecureData.delete_code'
        db.add_column('encrypt_securedata', 'delete_code',
                      self.gf('django.db.models.fields.CharField')(default='a', max_length=20),
                      keep_default=False)

        # Deleting field 'SecureData.secret_code'
        db.delete_column('encrypt_securedata', 'secret_code')


    models = {
        'encrypt.securedata': {
            'Meta': {'object_name': 'SecureData'},
            'data': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_mod': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'secret_code': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'title': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '40'})
        }
    }

    complete_apps = ['encrypt']
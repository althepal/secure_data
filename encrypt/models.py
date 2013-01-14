from django.db import models

class SecureData(models.Model):
	title = models.CharField(max_length=40, unique=True)
	data = models.TextField()
	last_mod = models.DateTimeField(auto_now=True)
	secret_code = models.CharField(max_length=20)

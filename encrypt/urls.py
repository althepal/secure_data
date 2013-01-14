from django.conf.urls import patterns, url

from encrypt import views

urlpatterns = patterns('', 
		url(r'^$', views.index, name='index'),
		url(r'^saveSecure$', views.save_secure, name='save_secure'),
		url(r'^delByTitle$', views.del_by_title, name='del_by_title'),
		) 

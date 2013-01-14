from django.shortcuts import render, get_object_or_404, HttpResponse
from django.utils import simplejson
from encrypt.models import SecureData
from django.views.decorators.csrf import csrf_exempt

def json_response(ret_data):
	msg = simplejson.dumps(ret_data)
	return HttpResponse(msg, mimetype='application/json')

def index(request):
	stored_data = SecureData.objects.all()
	context = {
			'title': "Secure Data",
			'stored_data': stored_data,
			}
	return render(request, 'secure_data.html', context)

@csrf_exempt
def save_secure(request):
	title = request.POST['title']
	data = request.POST['data']
	overwrite = request.POST['overwrite']
	secret_code = request.POST['secret_code']
	old_secret = request.POST['old_secret']

	if len(title) > 40:
		response = {
				'code': "Fail",
				'reason': 'Title too long (max len 40)',
				}
		return json_response(response)

	try:
		sd = SecureData.objects.get(title=title)
		if overwrite == '1':
			saved_secret = sd.secret_code
			if saved_secret != old_secret:
				response = {
						'code': "Fail",
						'reason': 'Secret code does not match.',
						}
				return json_response(response)
			sd.data = data
			sd.secret_code = secret_code
			sd.save()
		else:
			response = {
					'code': "Fail",
					'reason': 'Title already exists',
					}
			return json_response(response)
	except SecureData.DoesNotExist:
		sd = SecureData(title=title, data=data, secret_code=secret_code)
		sd.save()

	response = {
			'code': 'OK',
			'title': title,
			'data': data,
#			'last_mod': type(sd.last_mod),
			}
	return json_response(response)

@csrf_exempt
def del_by_title(request):
	title = request.POST['title']
	secret_code = request.POST['secret_code']
	try:
		sd = SecureData.objects.get(title=title)
		saved_secret = sd.secret_code
		if saved_secret != secret_code:
			response = {
					'code': "Fail",
					'reason': 'Secret code does not match.',
					}
			return json_response(response)
		sd.delete()
		response = {
				'code': "OK",
				'title': title,
				}
		return json_response(response)
	except SecureData.DoesNotExist:
		response = {
				'code': "Fail",
				'reason': 'Data not found.',
				}
		return json_response(response)
